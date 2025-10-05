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
import { Input } from '@/components/ui/input'
import striptags from 'striptags'
import NoButtonImageUploader from '@/components/common/NoButtonImageUploader'
import RichTextEditor from '@/components/common/RichTextEditor'
import fileService from '@/services/fileService'

const addBrandFormSchema = z.object({
    name: z.string().min(1, { message: 'Tên thương hiệu không được để trống.' }),
    description: z
        .string()
        .min(1, { message: 'Mô tả thương hiệu không được để trống.' })
        .refine(val => striptags(val).length > 0, {
            message: 'Mô tả thương hiệu không được để trống.'
        }),
    logoUrl: z.string().optional()
})

type AddBrandDialogProps = {
    addNewBrandMutation: UseMutationResult<any, any, Partial<IProductBrand>, any>
}

const AddBrandDialog = ({ addNewBrandMutation }: AddBrandDialogProps) => {
    const [open, setOpen] = useState(false)
    const { uploadBase64Mutation } = fileService()

    const form = useForm<z.infer<typeof addBrandFormSchema>>({
        resolver: zodResolver(addBrandFormSchema),
        defaultValues: {
            name: '',
            description: '',
            logoUrl: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof addBrandFormSchema>) => {
        const data: Partial<IProductBrand> = {
            name: values.name,
            description: values.description
        }

        if (values.logoUrl) {
            const res = await uploadBase64Mutation.mutateAsync({ base64: values.logoUrl, folder: 'logo' })
            const newImageUrl = res.data.data?.imageUrl
            if (newImageUrl) data.logoUrl = newImageUrl
        }

        await addNewBrandMutation.mutateAsync(data)

        form.reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="lighter">
                    <PencilLine />
                    Thêm thương hiệu
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>Thêm thương hiệu</DialogTitle>
                    <DialogDescription>
                        Thêm các thông tin cần thiết cho thương hiệu. Ấn "Xác nhận" sau khi hoàn tất.
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
                                                    hasPermission
                                                    image={field.value}
                                                    setImage={field.onChange}
                                                    originalImage={''}
                                                    shape="square"
                                                    allowRemove
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
                            <Button type="submit" disabled={form.formState.isLoading}>
                                Xác nhận
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddBrandDialog
