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
import { formSteps } from '@/features/damageReport/pages/AddDamagePage'
import { INVENTORY_DAMAGE_REASON_MAP } from '@/configs/constants'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'

type DataDamageReportDialogProps = {
    damageReport: IInventoryDamageReport | null
    open: boolean
    setOpen: (value: boolean) => void
}

const DataDamageReportDialog = ({ damageReport, open, setOpen }: DataDamageReportDialogProps) => {
    const columns: ColumnDef<IInventoryDamageReport['reportItems'][number]>[] = [
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
                                href={`/products/${productItem?.rootProduct.slug}`}
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
            header: () => <div className="text-center">Thiệt hại ước tính</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Badge variant="success">
                        <BadgeDollarSign /> {formatCurrency(row.original.expectedCost)}
                    </Badge>
                </div>
            )
        }
    ]

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>Thông tin báo cáo thiệt hại</DialogTitle>
                    <DialogDescription>
                        Thông tin chi tiết về thiệt hại ước tính và các sản phẩm của báo cáo thiệt hại.
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
                                    <span className="text-card-foreground font-medium">1.1. Phân loại thiệt hại: </span>
                                    {INVENTORY_DAMAGE_REASON_MAP[damageReport?.reason as InventoryDamageReason]}
                                </div>
                                <div className="text-justify">
                                    <span className="text-card-foreground font-medium">1.2. Ghi chú: </span>
                                    {damageReport?.note ?? '(Không có)'}
                                </div>
                                <div>
                                    <span className="text-card-foreground font-medium">
                                        1.3. Tổng thiệt hại ước tính:{' '}
                                    </span>
                                    {formatCurrency(damageReport?.totalExpectedCost)}
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
                            <DataTable data={damageReport?.reportItems ?? []} columns={columns} />
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
                                            src={damageReport?.reportedByStaff?.avatar as string}
                                            alt="product image"
                                            className="aspect-square h-full w-full rounded-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col">
                                        <p className="text-base font-medium break-words whitespace-normal">
                                            {damageReport?.reportedByStaff?.name}
                                        </p>
                                        <p className="text-muted-foreground break-words whitespace-normal">
                                            <span className="font-medium">Mã nhân viên: </span>
                                            {damageReport?.reportedBy}
                                        </p>
                                        <p className="text-muted-foreground break-words whitespace-normal">
                                            <span className="font-medium">Email: </span>
                                            {damageReport?.reportedByStaff?.email}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-card-foreground font-medium">
                                        3.2. Thời gian tạo báo cáo:{' '}
                                    </span>
                                    {dayjs(damageReport?.reportedAt).format('DD/MM/YYYY HH:mm:ss')}
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

export default DataDamageReportDialog
