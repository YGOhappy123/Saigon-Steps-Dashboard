import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store'
import damageService from '@/features/damageReport/services/damageService'
import ViewDamageReportDialog from '@/features/damageReport/components/ViewDamageReportDialog'
import DamageReportTable from '@/features/damageReport/components/DamageReportTable'
import verifyPermission from '@/utils/verifyPermission'
import permissions from '@/configs/permissions'

const DamageManagementPage = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedDamage, setSelectedDamage] = useState<IInventoryDamageReport | null>(null)
    const damageServiceData = damageService({ enableFetching: true })

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.name}!</h2>
                    <p className="text-muted-foreground">
                        Đây là danh sách báo cáo thiệt hại của hệ thống Saigon Steps.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.name} />
                    </Avatar>
                </div>
            </div>

            <ViewDamageReportDialog damageReport={selectedDamage} open={dialogOpen} setOpen={setDialogOpen} />

            <DamageReportTable
                damages={damageServiceData.damages}
                total={damageServiceData.total}
                page={damageServiceData.page}
                limit={damageServiceData.limit}
                setPage={damageServiceData.setPage}
                setLimit={damageServiceData.setLimit}
                buildQuery={damageServiceData.buildQuery}
                onFilterSearch={damageServiceData.onFilterSearch}
                onResetFilterSearch={damageServiceData.onResetFilterSearch}
                hasAddPermission={verifyPermission(user, permissions.addNewDamageReport)}
                onViewDamage={(damageReport: IInventoryDamageReport) => {
                    setSelectedDamage(damageReport)
                    setDialogOpen(true)
                }}
                getCsvDamagesQuery={damageServiceData.getCsvDamagesQuery}
            />
        </div>
    )
}

export default DamageManagementPage
