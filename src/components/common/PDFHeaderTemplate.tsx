import { ReactNode } from 'react'
import { Text, View, Image } from '@react-pdf/renderer'

type PDFHeaderPropsTemplate = {
    children?: ReactNode
}

const PDFHeaderTemplate = ({ children }: PDFHeaderPropsTemplate) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 20
            }}
        >
            <View style={{ alignItems: 'center' }}>
                <Text style={{ textTransform: 'uppercase', fontWeight: 'medium' }}>Cửa hàng giày dép thời trang</Text>
                <Text style={{ textTransform: 'capitalize', fontWeight: 'bold', fontSize: 16 }}>Saigon Steps</Text>
                <View style={{ width: 120, marginVertical: 6, height: 1, backgroundColor: '#000000' }}></View>
                <View style={{ width: '100%', gap: 2 }}>
                    <Text>
                        <Text style={{ fontWeight: 'medium' }}>Địa chỉ:</Text> 97 Man Thiện, Hiệp Phú, Thủ Đức
                    </Text>
                    <Text>
                        <Text style={{ fontWeight: 'medium' }}>Email:</Text> saigonsteps@gmail.com
                    </Text>
                    <Text>
                        <Text style={{ fontWeight: 'medium' }}>Số điện thoại:</Text> (+84)913.283.742
                    </Text>
                </View>
            </View>
            <View style={{ alignItems: 'center', gap: 2, maxWidth: '50%' }}>
                <Image src="/images/logo-with-slogan.png" style={{ width: 120, marginBottom: 6 }} />
                {children}
            </View>
        </View>
    )
}

export default PDFHeaderTemplate
