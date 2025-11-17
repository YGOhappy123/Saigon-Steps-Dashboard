import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { PencilLine } from 'lucide-react'
import { UseMutationResult } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

const addRoleFormSchema = z.object({
    name: z.string().min(1, { message: 'Tên vai trò không được để trống.' }),
    isImmutable: z.boolean(),
    permissions: z.array(z.number())
})

type AddRoleDialogProps = {
    permissions: IPermission[]
    addNewRoleMutation: UseMutationResult<any, any, Partial<IStaffRole>, any>
}

const AddRoleDialog = ({ permissions, addNewRoleMutation }: AddRoleDialogProps) => {
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof addRoleFormSchema>>({
        resolver: zodResolver(addRoleFormSchema),
        defaultValues: {
            name: '',
            isImmutable: false,
            permissions: []
        }
    })

    const onSubmit = async (values: z.infer<typeof addRoleFormSchema>) => {
        await addNewRoleMutation.mutateAsync({
            name: values.name,
            permissions: values.permissions
        })

        form.reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="lighter">
                    <PencilLine />
                    Thêm vai trò
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>Thêm vai trò nhân viên</DialogTitle>
                    <DialogDescription>
                        Thêm các thông tin cần thiết cho vai trò. Ấn "Xác nhận" sau khi hoàn tất.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">Tên vai trò</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Tên vai trò..."
                                                className="text-card-foreground caret-card-foreground h-12 rounded border-2 font-semibold"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isImmutable"
                                disabled
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">Loại vai trò</FormLabel>
                                        <Select onValueChange={() => {}} defaultValue={field.value?.toString()}>
                                            <FormControl>
                                                <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2 font-semibold">
                                                    <SelectValue placeholder="Chọn loại vai trò..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="false">Có thể chỉnh sửa</SelectItem>
                                                <SelectItem value="true" disabled>
                                                    Không thể chỉnh sửa
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="permissions"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">Danh sách quyền truy cập</FormLabel>
                                        <div className="grid max-h-[200px] grid-cols-1 gap-2 overflow-y-auto md:max-h-[300px] md:grid-cols-2">
                                            {permissions.map(permission => (
                                                <FormField
                                                    key={permission.permissionId}
                                                    control={form.control}
                                                    name="permissions"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={permission.permissionId}
                                                                className="flex flex-row items-center gap-2"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(
                                                                            permission.permissionId
                                                                        )}
                                                                        onCheckedChange={checked => {
                                                                            return checked
                                                                                ? field.onChange([
                                                                                      ...field.value,
                                                                                      permission.permissionId
                                                                                  ])
                                                                                : field.onChange(
                                                                                      field.value?.filter(
                                                                                          value =>
                                                                                              value !==
                                                                                              permission.permissionId
                                                                                      )
                                                                                  )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="text-card-foreground text-sm font-normal">
                                                                    {permission.name}
                                                                </FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Separator />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => form.reset()}>
                                Đặt lại
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    form.reset()
                                    setOpen(false)
                                }}
                            >
                                Hủy bỏ
                            </Button>
                            <Button type="submit">Xác nhận</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddRoleDialog
