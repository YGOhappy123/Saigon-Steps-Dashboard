import { Page, Text, View, Document } from '@react-pdf/renderer'
import { Table, TD, TH, TR } from '@ag-media/react-pdf-table'
import PDFHeaderTemplate from '@/components/common/PDFHeaderTemplate'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'

type InvoicePDFProps = {
    order: IOrder
}

const InvoicePDF = ({ order }: InvoicePDFProps) => {
    const isDelivery = order.deliveryAddress != null

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
                <InvoiceHeader order={order} />
                <Text
                    style={{
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: 20,
                        marginBottom: 12,
                        textAlign: 'center'
                    }}
                >
                    Hóa đơn bán hàng
                </Text>
                <View style={{ fontSize: 12, gap: 4, marginBottom: 12 }}>
                    <Text>
                        <Text style={{ fontWeight: 'medium' }}>Phương thức nhận hàng:</Text>{' '}
                        {isDelivery ? 'Vận chuyển qua đường bưu điện' : 'Nhận trực tiếp tại cửa hàng'}
                    </Text>
                    {isDelivery && (
                        <>
                            <Text>
                                <Text style={{ fontWeight: 'medium' }}>Họ và tên người nhận:</Text>{' '}
                                {order.recipientName}
                            </Text>
                            <Text>
                                <Text style={{ fontWeight: 'medium' }}>Số điện thoại người nhận:</Text>{' '}
                                {order.deliveryPhone}
                            </Text>
                            <Text>
                                <Text style={{ fontWeight: 'medium' }}>Địa chỉ nhận hàng:</Text> {order.deliveryAddress}
                            </Text>
                        </>
                    )}
                    <Text>
                        <Text style={{ fontWeight: 'medium' }}>Ghi chú:</Text> {order.note || '(Không có)'}
                    </Text>
                </View>
                <InvoiceProductsTable order={order} />
                <InvoiceSummary order={order} />
            </Page>
        </Document>
    )
}

const InvoiceHeader = ({ order }: { order: IOrder }) => {
    return (
        <PDFHeaderTemplate>
            <Text>
                <Text style={{ fontWeight: 'medium' }}>Mã đơn hàng:</Text> {order.orderId}
            </Text>
            <Text>
                <Text style={{ fontWeight: 'medium' }}>Đặt lúc:</Text>{' '}
                {dayjs(order.createdAt).format('HH:mm:ss ngày DD/MM/YYYY')}
            </Text>
            <Text>
                <Text style={{ fontWeight: 'medium' }}>Khách hàng:</Text> {order.customer.name}
            </Text>
        </PDFHeaderTemplate>
    )
}

const InvoiceProductsTable = ({ order }: { order: IOrder }) => {
    return (
        <Table weightings={[0.05, 0.45, 0.1, 0.1, 0.15, 0.15]} style={{ marginBottom: 12 }}>
            <TH style={{ backgroundColor: '#e5e5e5', fontWeight: 'semibold' }}>
                <TD style={{ padding: 6 }}>STT</TD>
                <TD style={{ padding: 6 }}>Tên sản phẩm</TD>
                <TD style={{ padding: 6 }}>Phân loại</TD>
                <TD style={{ padding: 6 }}>Số lượng</TD>
                <TD style={{ padding: 6 }}>Đơn giá</TD>
                <TD style={{ padding: 6 }}>Thành tiền</TD>
            </TH>
            {order.orderItems.map((item, index) => (
                <TR key={item.productItemId}>
                    <TD style={{ padding: 6, justifyContent: 'center' }}>{index + 1}</TD>
                    <TD style={{ padding: 6 }}>{item.productItem?.rootProduct.name}</TD>
                    <TD style={{ padding: 6, justifyContent: 'center' }}>{item.productItem?.size}</TD>
                    <TD style={{ padding: 6, justifyContent: 'center' }}>
                        {item.quantity.toString().padStart(2, '0')}
                    </TD>
                    <TD style={{ padding: 6, justifyContent: 'flex-end' }}>{formatCurrency(item.price)}</TD>
                    <TD style={{ padding: 6, justifyContent: 'flex-end' }}>
                        {formatCurrency(item.price * item.quantity)}
                    </TD>
                </TR>
            ))}
        </Table>
    )
}

const InvoiceSummary = ({ order }: { order: IOrder }) => {
    const total = order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <View style={{ fontSize: 12, gap: 4, alignItems: 'flex-end' }}>
            <Text>
                <Text style={{ fontWeight: 'medium' }}>Tổng tiền hàng:</Text> {formatCurrency(total)}
            </Text>
            <Text>
                <Text style={{ fontWeight: 'medium' }}>Giảm giá:</Text> {formatCurrency(total - order.totalAmount)}
            </Text>
            <View style={{ width: 120, marginVertical: 2, height: 1, backgroundColor: '#000000' }}></View>
            <Text>
                <Text style={{ fontWeight: 'medium' }}>Thành tiền:</Text> {formatCurrency(order.totalAmount)}
            </Text>
        </View>
    )
}

export default InvoicePDF
