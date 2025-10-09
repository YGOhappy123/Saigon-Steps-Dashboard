import { ColumnDef } from '@tanstack/react-table'
import { BadgeDollarSign } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AddImportData, formSteps } from '@/features/productImport/pages/AddImportPage'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'

type AddImportFormFinalStepProps = {
    data: AddImportData
    rootProducts: IRootProduct[]
    onConfirm: (values: AddImportData) => Promise<void>
    onPrev: () => void
    isLoading: boolean
}

const AddImportFormFinalStep = ({ data, rootProducts, onConfirm, onPrev, isLoading }: AddImportFormFinalStepProps) => {
    return (
        <div>
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
                                {data.invoiceNumber}
                            </div>
                            <div>
                                <span className="text-card-foreground font-medium">1.2. Ngày nhập hàng: </span>
                                {dayjs(data.importDate).format('DD/MM/YYYY HH:mm:ss')}
                            </div>
                            <div>
                                <span className="text-card-foreground font-medium">1.3. Tổng số tiền: </span>
                                {formatCurrency(data.items.reduce((acc, curr) => acc + curr.quantity * curr.cost, 0))}
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
                    <AccordionContent className="py-4">
                        <ProductReviewTable rootProducts={rootProducts} importItems={data.items} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div className="mt-6 grid grid-cols-1 items-center gap-4 xl:grid-cols-2">
                <Button
                    variant="outline"
                    disabled={isLoading}
                    onClick={onPrev}
                    className="h-12 rounded text-base capitalize"
                >
                    Quay về bước trước
                </Button>
                <Button
                    disabled={isLoading}
                    onClick={() => {
                        if (!isLoading) onConfirm(data)
                    }}
                    className="h-12 rounded text-base capitalize"
                >
                    {isLoading ? 'Đang tải...' : 'Tạo đơn nhập hàng'}
                </Button>
            </div>
        </div>
    )
}

type ProductReviewTableProps = {
    rootProducts: IRootProduct[]
    importItems: IProductImport['importItems']
}

const ProductReviewTable = ({ rootProducts, importItems }: ProductReviewTableProps) => {
    const getVariants = (productId: number) => {
        const product = rootProducts.find(rp => rp.rootProductId === productId)
        if (!product) return []

        return (product.productItems ?? []).map(pi => ({
            productItemId: pi.productItemId,
            label: pi.size
        }))
    }

    const columns: ColumnDef<IProductImport['importItems'][number]>[] = [
        {
            id: 'product',
            header: () => <div>Sản phẩm</div>,
            cell: ({ row }) => {
                const product = rootProducts.find(rp =>
                    rp.productItems?.some(pi => pi.productItemId === row.original.productItemId)
                )
                const variants = getVariants(product!.rootProductId)

                return (
                    <div className="flex items-start gap-2">
                        <div className="border-primary flex w-[70px] items-center justify-center overflow-hidden rounded-xl border-3 p-1">
                            <img
                                src={product?.images?.[0] as string}
                                alt="product image"
                                className="aspect-square h-full w-full rounded-lg object-cover"
                            />
                        </div>
                        <div className="flex flex-1 flex-col">
                            <a
                                className="line-clamp-1 text-base font-medium break-words whitespace-normal"
                                href={`/products/${product?.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {product?.name}
                            </a>
                            <p className="text-muted-foreground break-words whitespace-normal">
                                <span className="font-medium">Kích thước: </span>
                                {variants.find(v => v.productItemId === row.original.productItemId)?.label}
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
            accessorKey: 'price',
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

    return <DataTable data={importItems} columns={columns} />
}

export default AddImportFormFinalStep
