import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ThemeToggler from '@/components/common/ThemeToggler'

const MobileSidebar = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    if (user == null) return null

    // Use the first letters of the last 2 words in name
    // Eg: "Nguyễn Văn A" => "VA"
    const nameInitials = (user as IStaff).name
        .split(' ')
        .slice(0, 2)
        .map(str => str[0])
        .join('')

    return (
        <div className="bg-sidebar sticky top-0 z-[9999] flex items-center justify-between border-b-2 px-4 py-2">
            <div className="-ml-2 flex items-center">
                <SidebarTrigger />
                <ThemeToggler />
            </div>

            <div className="flex h-10 items-center gap-2 overflow-hidden">
                <div className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className="text-sm font-semibold">{user.name}</span>
                    <span className="text-xs">{user.email}</span>
                </div>
                <Avatar className="size-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground uppercase">
                        {nameInitials}
                    </AvatarFallback>
                </Avatar>
            </div>
        </div>
    )
}

export default MobileSidebar
