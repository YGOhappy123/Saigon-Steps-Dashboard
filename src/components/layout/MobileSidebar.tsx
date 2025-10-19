import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getNameInitials } from '@/utils/getNameInitials'
import ThemeToggler from '@/components/common/ThemeToggler'
import AudioToggler from '@/components/common/AudioToggler'

const MobileSidebar = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    if (user == null) return null

    return (
        <div className="bg-sidebar sticky top-0 z-[9999] flex items-center justify-between border-b-2 px-4 py-2">
            <div className="-ml-2 flex items-center">
                <SidebarTrigger />
                <ThemeToggler />
                <AudioToggler />
            </div>

            <div className="flex h-10 items-center gap-2 overflow-hidden">
                <div className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className="text-sm font-semibold">{user.name}</span>
                    <span className="text-xs">{user.email}</span>
                </div>
                <Avatar className="size-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground uppercase">
                        {getNameInitials(user.name)}
                    </AvatarFallback>
                </Avatar>
            </div>
        </div>
    )
}

export default MobileSidebar
