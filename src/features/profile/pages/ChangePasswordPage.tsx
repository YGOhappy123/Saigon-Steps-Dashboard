import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ChangePasswordForm from '@/features/profile/components/ChangePasswordForm'

const ChangePasswordPage = () => {
    return (
        <div className="flex flex-1 items-center justify-center">
            <Card className="w-full max-w-4xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Mật khẩu</CardTitle>
                    <CardDescription>Cập nhật mật khẩu cho tài khoản của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChangePasswordForm />
                </CardContent>
            </Card>
        </div>
    )
}

export default ChangePasswordPage
