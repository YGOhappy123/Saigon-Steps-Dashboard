import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store'
import importService from '@/features/productImport/services/importService'
import DataProductImportDialog from '@/features/productImport/components/DataProductImportDialog'
import ProductImportTable from '@/features/productImport/components/ProductImportTable'
import verifyPermission from '@/utils/verifyPermission'
import permissions from '@/configs/permissions'

const ImportManagementPage = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedImport, setSelectedImport] = useState<IProductImport | null>(null)
    const importServiceData = importService({ enableFetching: true })

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.name}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách đơn nhập hàng của hệ thống Saigon Steps.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.name} />
                    </Avatar>
                </div>
            </div>

            <DataProductImportDialog productImport={selectedImport} open={dialogOpen} setOpen={setDialogOpen} />

            <ProductImportTable
                imports={importServiceData.imports}
                total={importServiceData.total}
                page={importServiceData.page}
                limit={importServiceData.limit}
                setPage={importServiceData.setPage}
                setLimit={importServiceData.setLimit}
                buildQuery={importServiceData.buildQuery}
                onFilterSearch={importServiceData.onFilterSearch}
                onResetFilterSearch={importServiceData.onResetFilterSearch}
                hasAddPermission={verifyPermission(user, permissions.addNewImport)}
                onViewImport={(productImport: IProductImport) => {
                    setSelectedImport(productImport)
                    setDialogOpen(true)
                }}
                getCsvImportsQuery={importServiceData.getCsvImportsQuery}
            />
        </div>
    )
}

export default ImportManagementPage
