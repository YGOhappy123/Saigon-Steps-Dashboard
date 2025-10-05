import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store'
import categoryService from '@/features/category/services/categoryService'
import DataCategoryDialog from '@/features/category/components/DataCategoryDialog'
import CategoryTable from '@/features/category/components/CategoryTable'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'

const CategoryManagementPage = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState<'view' | 'update'>('view')
    const [selectedCategory, setSelectedCategory] = useState<IShoeCategory | null>(null)
    const categoryServiceData = categoryService({ enableFetching: true })

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.name}!</h2>
                    <p className="text-muted-foreground">
                        Đây là danh sách danh mục hàng hóa của hệ thống Saigon Steps.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.name} />
                    </Avatar>
                </div>
            </div>

            <DataCategoryDialog
                category={selectedCategory}
                mode={dialogMode}
                setMode={setDialogMode}
                open={dialogOpen}
                setOpen={setDialogOpen}
                updateCategoryMutation={categoryServiceData.updateCategoryMutation}
                hasUpdatePermission={verifyPermission(user, appPermissions.updateShoeCategory)}
            />

            <CategoryTable
                categories={categoryServiceData.categories}
                total={categoryServiceData.total}
                page={categoryServiceData.page}
                limit={categoryServiceData.limit}
                setPage={categoryServiceData.setPage}
                setLimit={categoryServiceData.setLimit}
                buildQuery={categoryServiceData.buildQuery}
                onFilterSearch={categoryServiceData.onFilterSearch}
                onResetFilterSearch={categoryServiceData.onResetFilterSearch}
                hasAddPermission={verifyPermission(user, appPermissions.addNewShoeCategory)}
                hasUpdatePermission={verifyPermission(user, appPermissions.updateShoeCategory)}
                hasDeletePermission={verifyPermission(user, appPermissions.deleteShoeCategory)}
                onViewCategory={(category: IShoeCategory) => {
                    setSelectedCategory(category)
                    setDialogMode('view')
                    setDialogOpen(true)
                }}
                onUpdateCategory={(category: IShoeCategory) => {
                    setSelectedCategory(category)
                    setDialogMode('update')
                    setDialogOpen(true)
                }}
                getCsvCategoriesQuery={categoryServiceData.getCsvCategoriesQuery}
                addNewCategoryMutation={categoryServiceData.addNewCategoryMutation}
                deleteCategoryMutation={categoryServiceData.deleteCategoryMutation}
            />
        </div>
    )
}

export default CategoryManagementPage
