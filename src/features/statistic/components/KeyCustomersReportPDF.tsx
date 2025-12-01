import { Page, Text, View, Document } from '@react-pdf/renderer'
import { Table, TD, TH, TR } from '@ag-media/react-pdf-table'
import { ReportData } from '@/features/statistic/pages/KeyCustomerStatisticPage'
import PDFHeaderTemplate from '@/components/common/PDFHeaderTemplate'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'

type KeyCustomersReportPDFProps = {
    reportData: ReportData
    user: IStaff
    limit: string
}

const KeyCustomersReportPDF = ({ reportData, user, limit }: KeyCustomersReportPDFProps) => {
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
                    Thống kê khách hàng nổi bật
                </Text>
                <View style={{ fontSize: 12, gap: 4, marginBottom: 12 }}>
                    <Text>
                        <Text style={{ fontWeight: 'medium' }}>Thời gian khảo sát:</Text> Từ{' '}
                        {dayjs(reportData.range.from).format('HH:mm ngày DD/MM/YYYY')} - Đến{' '}
                        {dayjs(reportData.range.to).format('HH:mm ngày DD/MM/YYYY')}
                    </Text>
                    <Text>
                        <Text style={{ fontWeight: 'medium' }}>Danh sách (1) bao gồm:</Text> Top {limit} khách hàng có
                        số lượng đơn đặt hàng cao nhất
                    </Text>
                    <Text>
                        <Text style={{ fontWeight: 'medium' }}>Ghi chú (1):</Text> Có bao gồm các đơn hàng chưa xử lý
                        hoặc thất bại
                    </Text>
                </View>
                <HighestOrderCountTable reportData={reportData} />
                <View style={{ fontSize: 12, gap: 4, marginBottom: 12 }}>
                    <Text>
                        <Text style={{ fontWeight: 'medium' }}>Danh sách (2) bao gồm:</Text> Top {limit} khách hàng có
                        tổng giá trị đơn hàng cao nhất
                    </Text>
                    <Text>
                        (2)
                        <Text style={{ fontWeight: 'medium' }}>Ghi chú (2):</Text> Chỉ tính trên các đơn hàng đã thu
                        tiền
                    </Text>
                </View>
                <HighestSpendingTable reportData={reportData} />
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

const HighestOrderCountTable = ({ reportData }: { reportData: ReportData }) => {
    return (
        <Table weightings={[0.05, 0.15, 0.25, 0.25, 0.15, 0.15]} style={{ marginBottom: 12 }}>
            <TH style={{ backgroundColor: '#e5e5e5', fontWeight: 'semibold' }}>
                <TD style={{ padding: 6 }}>STT</TD>
                <TD style={{ padding: 6 }}>Mã khách hàng</TD>
                <TD style={{ padding: 6 }}>Tên khách hàng</TD>
                <TD style={{ padding: 6 }}>Địa chỉ email</TD>
                <TD style={{ padding: 6 }}>Tổng số đơn hàng</TD>
                <TD style={{ padding: 6 }}>Trạng thái tài khoản</TD>
            </TH>
            {reportData.highestOrderCountCustomers.map((item, index) => (
                <TR key={item.customerId}>
                    <TD style={{ padding: 6, justifyContent: 'center' }}>{index + 1}</TD>
                    <TD style={{ padding: 6 }}>{item.customerId}</TD>
                    <TD style={{ padding: 6 }}>{item.name}</TD>
                    <TD style={{ padding: 6 }}>{item.email ?? 'Chưa cập nhật'}</TD>
                    <TD style={{ padding: 6, justifyContent: 'center' }}>
                        {item.orderCount.toString().padStart(2, '0')}
                    </TD>
                    <TD style={{ padding: 6 }}>{item.isActive ? 'Còn hoạt động' : 'Đã bị khóa'}</TD>
                </TR>
            ))}
        </Table>
    )
}

const HighestSpendingTable = ({ reportData }: { reportData: ReportData }) => {
    return (
        <Table weightings={[0.05, 0.15, 0.25, 0.25, 0.15, 0.15]} style={{ marginBottom: 12 }}>
            <TH style={{ backgroundColor: '#e5e5e5', fontWeight: 'semibold' }}>
                <TD style={{ padding: 6 }}>STT</TD>
                <TD style={{ padding: 6 }}>Mã khách hàng</TD>
                <TD style={{ padding: 6 }}>Tên khách hàng</TD>
                <TD style={{ padding: 6 }}>Địa chỉ email</TD>
                <TD style={{ padding: 6 }}>Tổng giá trị đơn hàng</TD>
                <TD style={{ padding: 6 }}>Trạng thái tài khoản</TD>
            </TH>
            {reportData.highestSpendingCustomers.map((item, index) => (
                <TR key={item.customerId}>
                    <TD style={{ padding: 6, justifyContent: 'center' }}>{index + 1}</TD>
                    <TD style={{ padding: 6 }}>{item.customerId}</TD>
                    <TD style={{ padding: 6 }}>{item.name}</TD>
                    <TD style={{ padding: 6 }}>{item.email ?? 'Chưa cập nhật'}</TD>
                    <TD style={{ padding: 6, justifyContent: 'flex-end' }}>{formatCurrency(item.orderAmount)}</TD>
                    <TD style={{ padding: 6 }}>{item.isActive ? 'Còn hoạt động' : 'Đã bị khóa'}</TD>
                </TR>
            ))}
        </Table>
    )
}

export default KeyCustomersReportPDF
