import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store'
import brandService from '@/features/brand/services/brandService'
import DataBrandDialog from '@/features/brand/components/DataBrandDialog'
import BrandTable from '@/features/brand/components/BrandTable'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'

const BrandManagementPage = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState<'view' | 'update'>('view')
    const [selectedBrand, setSelectedBrand] = useState<IProductBrand | null>(null)
    const brandServiceData = brandService({ enableFetching: true })

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.name}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách thương hiệu của hệ thống Saigon Steps.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.name} />
                    </Avatar>
                </div>
            </div>

            <DataBrandDialog
                brand={selectedBrand}
                mode={dialogMode}
                setMode={setDialogMode}
                open={dialogOpen}
                setOpen={setDialogOpen}
                updateBrandMutation={brandServiceData.updateBrandMutation}
                hasUpdatePermission={verifyPermission(user, appPermissions.updateProductBrand)}
            />

            <BrandTable
                brands={brandServiceData.brands}
                total={brandServiceData.total}
                page={brandServiceData.page}
                limit={brandServiceData.limit}
                setPage={brandServiceData.setPage}
                setLimit={brandServiceData.setLimit}
                buildQuery={brandServiceData.buildQuery}
                onFilterSearch={brandServiceData.onFilterSearch}
                onResetFilterSearch={brandServiceData.onResetFilterSearch}
                hasAddPermission={verifyPermission(user, appPermissions.addNewProductBrand)}
                hasUpdatePermission={verifyPermission(user, appPermissions.updateProductBrand)}
                hasDeletePermission={verifyPermission(user, appPermissions.deleteProductBrand)}
                onViewBrand={(brand: IProductBrand) => {
                    setSelectedBrand(brand)
                    setDialogMode('view')
                    setDialogOpen(true)
                }}
                onUpdateBrand={(brand: IProductBrand) => {
                    setSelectedBrand(brand)
                    setDialogMode('update')
                    setDialogOpen(true)
                }}
                getCsvBrandsQuery={brandServiceData.getCsvBrandsQuery}
                addNewBrandMutation={brandServiceData.addNewBrandMutation}
                deleteBrandMutation={brandServiceData.deleteBrandMutation}
            />
        </div>
    )
}

export default BrandManagementPage
