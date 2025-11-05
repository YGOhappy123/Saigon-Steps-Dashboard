import { useEffect, useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { CirclePlus, PencilLine } from 'lucide-react'
import { Result as ScanResult } from '@zxing/library'
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import BarcodeScanner from 'react-qr-barcode-scanner'

type ScanBarcodeDialogProps = {
    orderItems: IOrder['orderItems']
    selectedStatusId: number | null
    open: boolean
    setOpen: (value: boolean) => void
    onSubmit: (newStatus: number) => Promise<void>
    isLoading: boolean
}

const ScanBarcodeDialog = ({
    orderItems,
    selectedStatusId,
    open,
    setOpen,
    onSubmit,
    isLoading
}: ScanBarcodeDialogProps) => {
    const [input, setInput] = useState('')
    const [message, setMessage] = useState('')
    const [scannedValues, setScannedValues] = useState<{ [key: string]: number }>({})

    const handleSubmit = async () => {
        if (selectedStatusId == null) return

        await onSubmit(selectedStatusId)
        setOpen(false)
    }

    const isSubmittable = useMemo(() => {
        for (const item of orderItems) {
            const scannedQuantity = scannedValues[item.productItem!.barcode] || 0
            if (scannedQuantity < item.quantity) {
                return false
            }
        }
        return true
    }, [orderItems, scannedValues])

    useEffect(() => {
        if (open && orderItems.length > 0) {
            const newValues = orderItems.reduce(
                (acc, item) => {
                    acc[item.productItem!.barcode] = 0
                    return acc
                },
                {} as { [key: string]: number }
            )
            setScannedValues(newValues)
            setMessage('Quét hoặc nhập mã vạch của sản phẩm.')
        }
    }, [open, orderItems])

    const handleScan = (_: any, result: ScanResult | undefined) => {
        if (result) {
            handleAdd(result.getText())
        }
    }

    const handleAdd = (scannedCode: string) => {
        if (scannedValues[scannedCode] === undefined) {
            setMessage('Mã vạch không hợp lệ hoặc không thuộc đơn hàng.')
        } else {
            const maxQuantity = orderItems.find(item => item.productItem!.barcode === scannedCode)!.quantity
            if (scannedValues[scannedCode] < maxQuantity) {
                setScannedValues(prev => ({
                    ...prev,
                    [scannedCode]: prev[scannedCode] + 1
                }))
                setMessage(`Mã vạch [${scannedCode}] đã được quét hợp lệ.`)
            } else {
                setMessage(`Mã vạch [${scannedCode}] đã được quét đủ số lượng.`)
            }
        }
        setInput('')
    }

    const columns: ColumnDef<IOrder['orderItems'][number]>[] = [
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
                            <span className="line-clamp-1 text-base font-medium break-words whitespace-normal">
                                {productItem!.rootProduct.name}
                            </span>
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
            accessorKey: 'scanned',
            header: () => <div className="text-center">Đã quét</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    {(scannedValues[row.original.productItem!.barcode] || 0).toString().padStart(2, '0')}
                </div>
            )
        }
    ]

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl md:min-w-3xl xl:min-w-4xl">
                <DialogHeader>
                    <DialogTitle>Quét mã vạch để cập nhật trạng thái đơn hàng</DialogTitle>
                    <DialogDescription>
                        Trạng thái đơn hàng này yêu cầu quét mã vạch của sản phẩm. Vui lòng sử dụng camera để quét mã
                        vạch và xác nhận cập nhật trạng thái.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 flex flex-col gap-4">
                        <p className="text-primary text-base">
                            <span className="font-semibold">Thông báo: </span>
                            {message}
                        </p>
                        <DataTable data={orderItems ?? []} columns={columns} />
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="border-primary overflow-hidden rounded border-2">
                            <BarcodeScanner
                                delay={1500}
                                onUpdate={handleScan}
                                onError={(error: any) => {
                                    if (error.name === 'NotAllowedError') {
                                        setMessage('Không có quyền truy cập camera.')
                                    }
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <Input
                                placeholder="Nhập mã vạch"
                                className="caret-card-foreground text-card-foreground h-12 rounded border-2 font-semibold"
                                value={input}
                                onChange={e => /^\d*$/.test(e.target.value) && setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAdd(input))}
                            />
                            <Button
                                disabled={!input}
                                onClick={() => handleAdd(input)}
                                className="aspect-square h-12 rounded text-base capitalize"
                            >
                                Nhập
                            </Button>
                        </div>
                    </div>
                </div>
                <Separator />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Đóng</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSubmit} disabled={isLoading || !isSubmittable}>
                        <PencilLine />
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ScanBarcodeDialog
