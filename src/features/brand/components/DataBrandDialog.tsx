import { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UseMutationResult } from '@tanstack/react-query'
import { PencilLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import striptags from 'striptags'
import NoButtonImageUploader from '@/components/common/NoButtonImageUploader'
import RichTextEditor from '@/components/common/RichTextEditor'
import fileService from '@/services/fileService'

const dataBrandFormSchema = z.object({
    name: z.string().min(1, { message: 'Tên thương hiệu không được để trống.' }),
    description: z
        .string()
        .min(1, { message: 'Mô tả thương hiệu không được để trống.' })
        .refine(val => striptags(val).length > 0, {
            message: 'Mô tả thương hiệu không được để trống.'
        }),
    logoUrl: z.string().optional()
})

type DataBrandDialogProps = {
    brand: IProductBrand | null
    mode: 'view' | 'update'
    setMode: (value: 'view' | 'update') => void
    open: boolean
    setOpen: (value: boolean) => void
    updateBrandMutation: UseMutationResult<any, any, { brandId: number; data: Partial<IProductBrand> }, any>
    hasUpdatePermission: boolean
}

const DataBrandDialog = ({
    brand,
    updateBrandMutation,
    hasUpdatePermission,
    mode,
    open,
    setMode,
    setOpen
}: DataBrandDialogProps) => {
    const { uploadBase64Mutation } = fileService()

    const form = useForm<z.infer<typeof dataBrandFormSchema>>({
        resolver: zodResolver(dataBrandFormSchema),
        defaultValues: {
            name: '',
            description: '',
            logoUrl: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof dataBrandFormSchema>) => {
        if (!brand || !hasUpdatePermission) return

        const data: Partial<IProductBrand> = {
            name: values.name,
            description: values.description,
            logoUrl: brand.logoUrl
        }

        if (values.logoUrl && values.logoUrl !== brand.logoUrl) {
            const res = await uploadBase64Mutation.mutateAsync({ base64: values.logoUrl, folder: 'brand' })
            const newImageUrl = res.data.data?.imageUrl
            if (newImageUrl) data.logoUrl = newImageUrl
        }

        if (!values.logoUrl && values.logoUrl !== brand.logoUrl) {
            data.logoUrl = ''
        }

        await updateBrandMutation.mutateAsync({
            brandId: brand.brandId,
            data: data
        })

        form.reset()
        setOpen(false)
    }

    useEffect(() => {
        if (open && brand) {
            form.reset({
                name: brand.name,
                description: brand.description,
                logoUrl: brand.logoUrl ?? ''
            })
        }
    }, [open, mode, brand])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>{mode === 'view' ? 'Thông tin thương hiệu' : 'Cập nhật thương hiệu'}</DialogTitle>
                    <DialogDescription>
                        {mode === 'view'
                            ? 'Thông tin chi tiết về tên và mô tả thương hiệu.'
                            : 'Chỉnh sửa các thông tin của thương hiệu. Ấn "Xác nhận" sau khi hoàn tất.'}
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                            <div className="col-span-1">
                                <FormField
                                    control={form.control}
                                    name="logoUrl"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col items-center">
                                            <FormLabel className="text-card-foreground">Ảnh logo</FormLabel>
                                            <FormControl>
                                                <NoButtonImageUploader
                                                    hasPermission={mode === 'update'}
                                                    image={field.value ?? ''}
                                                    setImage={field.onChange}
                                                    originalImage={brand?.logoUrl ?? ''}
                                                    shape="square"
                                                    allowDelete
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-1 flex flex-col gap-6 md:col-span-2">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Tên thương hiệu</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Tên thương hiệu..."
                                                    className="caret-card-foreground text-card-foreground h-12 rounded border-2 font-semibold"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Mô tả thương hiệu</FormLabel>
                                            <FormControl>
                                                <RichTextEditor
                                                    content={field.value}
                                                    onChange={field.onChange}
                                                    containerClassName="rounded border-2"
                                                    editorClassName="caret-card-foreground text-card-foreground"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <Separator />
                        {mode === 'update' && (
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Hủy bỏ</Button>
                                </DialogClose>
                                <Button type="submit">Xác nhận</Button>
                            </DialogFooter>
                        )}
                    </form>
                </Form>

                {/* Move <DialogFooter /> outside <Form /> to prevent auto-submitting behavior */}
                {mode === 'view' && (
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Đóng</Button>
                        </DialogClose>
                        {hasUpdatePermission && (
                            <Button type="button" onClick={() => setMode('update')}>
                                <PencilLine />
                                Chỉnh sửa
                            </Button>
                        )}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default DataBrandDialog
