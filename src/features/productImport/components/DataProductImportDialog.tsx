import { ColumnDef } from '@tanstack/react-table'
import { BadgeDollarSign } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formSteps } from '@/features/productImport/pages/AddImportPage'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'

type DataProductImportDialogProps = {
    productImport: IProductImport | null
    open: boolean
    setOpen: (value: boolean) => void
}

const DataProductImportDialog = ({ productImport, open, setOpen }: DataProductImportDialogProps) => {
    const columns: ColumnDef<IProductImport['importItems'][number]>[] = [
        {
            id: 'product',
            header: () => <div>Sản phẩm</div>,
            cell: ({ row }) => {
                const productItem = row.original.productItem
                return (
                    <div className="flex items-start gap-2">
                        <div className="border-primary flex w-[70px] items-center justify-center overflow-hidden rounded-xl border-3 p-1">
                            <img
                                src={productItem?.rootProduct.images[0] as string}
                                alt="product image"
                                className="aspect-square h-full w-full rounded-lg object-cover"
                            />
                        </div>
                        <div className="flex flex-1 flex-col">
                            <a
                                className="line-clamp-1 text-base font-medium break-words whitespace-normal"
                                href={`/san-pham/${productItem?.rootProduct.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {productItem!.rootProduct.name}
                            </a>
                            <p className="text-muted-foreground break-words whitespace-normal">
                                <span className="font-medium">Kích thước: </span>
                                {productItem!.size}
                            </p>
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: 'quantity',
            header: () => <div className="text-center">Số lượng</div>,
            cell: ({ row }) => <div className="text-center">{row.original.quantity.toString().padStart(2, '0')}</div>
        },
        {
            accessorKey: 'cost',
            header: () => <div className="text-center">Đơn giá</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Badge variant="success">
                        <BadgeDollarSign /> {formatCurrency(row.original.cost)}
                    </Badge>
                </div>
            )
        }
    ]

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>Thông tin đơn nhập hàng</DialogTitle>
                    <DialogDescription>
                        Thông tin chi tiết về ngày nhập hàng, số tiền và các sản phẩm của đơn nhập hàng.
                    </DialogDescription>
                </DialogHeader>
                <Separator />

                <Accordion type="multiple" className="w-full" defaultValue={['item-1']}>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="hover:bg-muted/50 cursor-pointer items-center px-4">
                            <div className="flex flex-col">
                                <h4 className="text-lg font-semibold">1. {formSteps[0].title}</h4>
                                <span className="text-muted-foreground text-sm">{formSteps[0].description}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-1 flex-col gap-4 p-4">
                                <div className="text-justify">
                                    <span className="text-card-foreground font-medium">1.1. Mã hóa đơn: </span>
                                    {productImport?.invoiceNumber}
                                </div>
                                <div>
                                    <span className="text-card-foreground font-medium">1.2. Ngày nhập hàng: </span>
                                    {dayjs(productImport?.importDate).format('DD/MM/YYYY HH:mm:ss')}
                                </div>
                                <div>
                                    <span className="text-card-foreground font-medium">1.3. Tổng số tiền: </span>
                                    {formatCurrency(productImport?.totalCost)}
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger className="hover:bg-muted/50 cursor-pointer items-center px-4">
                            <div className="flex flex-col">
                                <h4 className="text-lg font-semibold">2. {formSteps[1].title}</h4>
                                <span className="text-muted-foreground text-sm">{formSteps[1].description}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="max-h-[200px] overflow-y-auto p-4">
                            <DataTable data={productImport?.importItems ?? []} columns={columns} />
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger className="hover:bg-muted/50 cursor-pointer items-center px-4">
                            <div className="flex flex-col">
                                <h4 className="text-lg font-semibold">3. Nhân viên ghi nhận</h4>
                                <span className="text-muted-foreground text-sm">
                                    Thông tin về nhân viên và thời gian ghi nhận
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-1 flex-col gap-4 p-4">
                                <span className="text-card-foreground font-medium">3.1. Thông tin nhân viên: </span>
                                <div className="flex items-start gap-2">
                                    <div className="border-primary flex w-[70px] items-center justify-center overflow-hidden rounded-full border-3 p-1">
                                        <img
                                            src={productImport?.trackedByStaff?.avatar as string}
                                            alt="product image"
                                            className="aspect-square h-full w-full rounded-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col">
                                        <p className="text-base font-medium break-words whitespace-normal">
                                            {productImport?.trackedByStaff?.name}
                                        </p>
                                        <p className="text-muted-foreground break-words whitespace-normal">
                                            <span className="font-medium">Mã nhân viên: </span>
                                            {productImport?.trackedBy}
                                        </p>
                                        <p className="text-muted-foreground break-words whitespace-normal">
                                            <span className="font-medium">Email: </span>
                                            {productImport?.trackedByStaff?.email}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-card-foreground font-medium">3.2. Thời gian ghi nhận: </span>
                                    {dayjs(productImport?.trackedAt).format('DD/MM/YYYY HH:mm:ss')}
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Separator />

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Đóng</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DataProductImportDialog
