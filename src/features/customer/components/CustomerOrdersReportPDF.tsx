import { Page, Text, View, Document } from '@react-pdf/renderer'
import { Table, TD, TH, TR } from '@ag-media/react-pdf-table'
import { ReportData } from '@/features/customer/components/ViewOrdersStatisticDialog'
import PDFHeaderTemplate from '@/components/common/PDFHeaderTemplate'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'

type CustomerOrdersReportPDFProps = {
    reportData: ReportData
    user: IStaff
    customer: ICustomer
}

const CustomerOrdersReportPDF = ({ reportData, user, customer }: CustomerOrdersReportPDFProps) => {
    return (
        <Document>
            <Page
                size="A4"
                style={{
                    backgroundColor: '#ffffff',
                    color: '#262626',
                    fontFamily: 'Roboto',
                    fontSize: '10px',
                    padding: '50px 50px'
                }}
            >
                <ReportHeader user={user} />
                <Text
                    style={{
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: 20,
                        marginBottom: 12,
                        textAlign: 'center'
                    }}
                >
                    Thống kê đơn hàng của khách hàng
                </Text>
                <View style={{ fontSize: 12, gap: 4, marginBottom: 12 }}>
                    <Text>
                        <Text style={{ fontWeight: 'medium' }}>Mã khách hàng:</Text> {customer.customerId}
                    </Text>
                    <Text>
                        <Text style={{ fontWeight: 'medium' }}>Họ và tên khách hàng:</Text> {customer.name}
                    </Text>
                    <Text>
                        <Text style={{ fontWeight: 'medium' }}>Địa chỉ email:</Text> {customer.email ?? 'Chưa cập nhật'}
                    </Text>
                    <Text>
                        <Text style={{ fontWeight: 'medium' }}>Thời gian khảo sát:</Text> Từ{' '}
                        {dayjs(reportData.range.from).format('HH:mm ngày DD/MM/YYYY')} - Đến{' '}
                        {dayjs(reportData.range.to).format('HH:mm ngày DD/MM/YYYY')}
                    </Text>
                </View>
                <OrdersSummaryTable reportData={reportData} />
                <OrdersStatisticTable chartData={reportData.chart} />
                <ReportSummary reportData={reportData} />
            </Page>
        </Document>
    )
}

const ReportHeader = ({ user }: { user: IStaff }) => {
    return (
        <PDFHeaderTemplate>
            <Text>
                <Text style={{ fontWeight: 'medium' }}>Ngày báo cáo:</Text> {dayjs().format('HH:mm:ss ngày DD/MM/YYYY')}
            </Text>
            <Text>
                <Text style={{ fontWeight: 'medium' }}>Người tạo:</Text> {user.name}
            </Text>
        </PDFHeaderTemplate>
    )
}

const OrdersSummaryTable = ({ reportData }: { reportData: ReportData }) => {
    return (
        <Table weightings={[0.05, 0.7, 0.25]} style={{ marginBottom: 12 }}>
            <TH style={{ backgroundColor: '#e5e5e5', fontWeight: 'semibold' }}>
                <TD style={{ padding: 6 }}>STT</TD>
                <TD style={{ padding: 6 }}>Tiêu chí tổng hợp</TD>
                <TD style={{ padding: 6 }}>Số lượng đơn hàng</TD>
            </TH>
            {[
                { key: 'placed', label: 'Tổng đơn hàng đã tạo', value: reportData.count.placed },
                { key: 'accounted', label: 'Tổng đơn hàng đã thanh toán', value: reportData.count.accounted },
                { key: 'refunded', label: 'Tổng đơn hàng đã hoàn trả', value: reportData.count.refunded }
            ].map((item, index) => (
                <TR key={item.key}>
                    <TD style={{ padding: 6, justifyContent: 'center' }}>{index + 1}</TD>
                    <TD style={{ padding: 6 }}>{item.label}</TD>
                    <TD style={{ padding: 6, justifyContent: 'center' }}>{item.value.toString().padStart(2, '0')}</TD>
                </TR>
            ))}
        </Table>
    )
}

const OrdersStatisticTable = ({ chartData }: { chartData: ReportData['chart'] }) => {
    return (
        <Table weightings={[0.05, 0.35, 0.2, 0.2, 0.2]} style={{ marginBottom: 12 }}>
            <TH style={{ backgroundColor: '#e5e5e5', fontWeight: 'semibold' }}>
                <TD style={{ padding: 6 }}>STT</TD>
                <TD style={{ padding: 6 }}>Mốc thời gian</TD>
                <TD style={{ padding: 6 }}>Tiền từ đơn hàng</TD>
                <TD style={{ padding: 6 }}>Số tiền hoàn trả</TD>
                <TD style={{ padding: 6 }}>Doanh thu</TD>
            </TH>
            {chartData.map((item, index) => {
                const revenue = item.totalSales + item.totalRefunds
                return (
                    <TR key={item.name}>
                        <TD style={{ padding: 6, justifyContent: 'center' }}>{index + 1}</TD>
                        <TD style={{ padding: 6 }}>{item.name}</TD>
                        <TD style={{ padding: 6, justifyContent: 'flex-end' }}>{formatCurrency(item.totalSales)}</TD>
                        <TD style={{ padding: 6, justifyContent: 'flex-end' }}>{formatCurrency(item.totalRefunds)}</TD>
                        <TD style={{ padding: 6, justifyContent: 'flex-end' }}>{formatCurrency(revenue)}</TD>
                    </TR>
                )
            })}
        </Table>
    )
}

const ReportSummary = ({ reportData }: { reportData: ReportData }) => {
    const sumOfSales = reportData.chart.reduce((sum, item) => sum + item.totalSales, 0)
    const sumOfRefunds = reportData.chart.reduce((sum, item) => sum + item.totalRefunds, 0)

    return (
        <View style={{ fontSize: 12, gap: 4, alignItems: 'flex-end' }}>
            <Text>
                <Text style={{ fontWeight: 'medium' }}>Tổng tiền từ đơn hàng:</Text> {formatCurrency(sumOfSales)}
            </Text>

            <Text>
                <Text style={{ fontWeight: 'medium' }}>Tổng số tiền hoàn trả:</Text> {formatCurrency(sumOfRefunds)}
            </Text>
            <View style={{ width: 120, marginVertical: 2, height: 1, backgroundColor: '#000000' }}></View>
            <Text>
                <Text style={{ fontWeight: 'medium' }}>Tổng doanh thu:</Text>{' '}
                {formatCurrency(sumOfSales + sumOfRefunds)}
            </Text>
        </View>
    )
}

export default CustomerOrdersReportPDF
