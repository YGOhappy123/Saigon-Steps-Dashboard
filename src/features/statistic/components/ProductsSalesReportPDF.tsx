import { Page, Text, View, Document } from '@react-pdf/renderer'
import { Table, TD, TH, TR } from '@ag-media/react-pdf-table'
import { ReportData } from '@/features/statistic/pages/ProductStatisticPage'
import PDFHeaderTemplate from '@/components/common/PDFHeaderTemplate'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'

type ProductsSalesReportPDFProps = {
    reportData: ReportData
    user: IStaff
    hasActivity: boolean
}

const ProductsSalesReportPDF = ({ reportData, user, hasActivity }: ProductsSalesReportPDFProps) => {
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
                    Thống kê doanh số sản phẩm
                </Text>
                <View style={{ fontSize: 12, gap: 4, marginBottom: 12 }}>
                    <Text>
                        <Text style={{ fontWeight: 'medium' }}>Thời gian khảo sát:</Text> Từ{' '}
                        {dayjs(reportData.range.from).format('HH:mm ngày DD/MM/YYYY')} - Đến{' '}
                        {dayjs(reportData.range.to).format('HH:mm ngày DD/MM/YYYY')}
                    </Text>
                    <Text>
                        <Text style={{ fontWeight: 'medium' }}>Danh sách bao gồm:</Text>{' '}
                        {hasActivity ? 'Các sản phẩm có phát sinh giao dịch' : 'Tất cả sản phẩm trên hệ thống'}
                    </Text>
                </View>
                <ProductsSalesTable reportData={reportData} />
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

const ProductsSalesTable = ({ reportData }: { reportData: ReportData }) => {
    return (
        <Table weightings={[0.05, 0.45, 0.1, 0.15, 0.1, 0.15]} style={{ marginBottom: 12 }}>
            <TH style={{ backgroundColor: '#e5e5e5', fontWeight: 'semibold' }}>
                <TD style={{ padding: 6 }}>STT</TD>
                <TD style={{ padding: 6 }}>Tên sản phẩm</TD>
                <TD style={{ padding: 6 }}>Số lượng bán ra</TD>
                <TD style={{ padding: 6 }}>Doanh số bán ra</TD>
                <TD style={{ padding: 6 }}>Số lượng hoàn trả</TD>
                <TD style={{ padding: 6 }}>Số tiền hoàn trả</TD>
            </TH>
            {reportData.sales.map((item, index) => (
                <TR key={item.rootProductId}>
                    <TD style={{ padding: 6, justifyContent: 'center' }}>{index + 1}</TD>
                    <TD style={{ padding: 6 }}>{item.rootProduct.name}</TD>
                    <TD style={{ padding: 6, justifyContent: 'center' }}>
                        {item.sales.totalSoldUnits.toString().padStart(2, '0')}
                    </TD>
                    <TD style={{ padding: 6, justifyContent: 'flex-end' }}>{formatCurrency(item.sales.totalSales)}</TD>
                    <TD style={{ padding: 6, justifyContent: 'center' }}>
                        {item.sales.totalRefundedUnits.toString().padStart(2, '0')}
                    </TD>
                    <TD style={{ padding: 6, justifyContent: 'flex-end' }}>
                        {formatCurrency(item.sales.totalRefundedAmount)}
                    </TD>
                </TR>
            ))}
        </Table>
    )
}

const ReportSummary = ({ reportData }: { reportData: ReportData }) => {
    return (
        <View style={{ fontSize: 12, gap: 4, alignItems: 'flex-end' }}>
            <Text>
                <Text style={{ fontWeight: 'medium' }}>Tổng số lượng bán ra:</Text>{' '}
                {reportData.sales
                    .reduce((sum, item) => sum + item.sales.totalSoldUnits, 0)
                    .toString()
                    .padStart(2, '0')}
            </Text>
            <Text>
                <Text style={{ fontWeight: 'medium' }}>Tổng doanh số bán ra:</Text>{' '}
                {formatCurrency(reportData.sales.reduce((sum, item) => sum + item.sales.totalSales, 0))}
            </Text>
            <View style={{ width: 120, marginVertical: 2, height: 1, backgroundColor: '#000000' }}></View>
            <Text>
                <Text style={{ fontWeight: 'medium' }}>Tổng số lượng hoàn trả:</Text>{' '}
                {reportData.sales
                    .reduce((sum, item) => sum + item.sales.totalRefundedUnits, 0)
                    .toString()
                    .padStart(2, '0')}
            </Text>
            <Text>
                <Text style={{ fontWeight: 'medium' }}>Tổng số tiền hoàn trả:</Text>{' '}
                {formatCurrency(reportData.sales.reduce((sum, item) => sum + item.sales.totalRefundedAmount, 0))}
            </Text>
        </View>
    )
}

export default ProductsSalesReportPDF
