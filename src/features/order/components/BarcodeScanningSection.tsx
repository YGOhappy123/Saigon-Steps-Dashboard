import { useEffect, useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'

type BarcodeScanningSectionProps = {
    orderItems: IOrder['orderItems']
    open: boolean
    setIsBarcodeSubmittable: (value: boolean) => void
}

const BarcodeScanningSection = ({ orderItems, open, setIsBarcodeSubmittable }: BarcodeScanningSectionProps) => {
    const [input, setInput] = useState('')
    const [message, setMessage] = useState('')
    const [scannedValues, setScannedValues] = useState<{ [key: string]: number }>({})

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
        setIsBarcodeSubmittable(isSubmittable)
    }, [isSubmittable, setIsBarcodeSubmittable])

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

    useEffect(() => {
        if (!open) return

        let buffer = ''
        let lastTime = Date.now()
        const SCAN_TIMEOUT = 100

        const handleKeyDown = (e: KeyboardEvent) => {
            const now = Date.now()

            if (now - lastTime > SCAN_TIMEOUT) {
                buffer = ''
            }
            lastTime = now

            if (e.key === 'Enter') {
                if (buffer) {
                    e.preventDefault()
                    e.stopPropagation()
                    handleAdd(buffer)
                    buffer = ''
                }
                return
            }

            if (/^\d$/.test(e.key)) {
                buffer += e.key
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [open, scannedValues])

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
        <>
            <div className="flex flex-col gap-4">
                <p className="text-primary text-base">
                    <span className="font-semibold">Thông báo: </span>
                    {message}
                </p>

                <DataTable data={orderItems ?? []} columns={columns} />

                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Nhập mã vạch"
                        className="caret-card-foreground text-card-foreground h-12 rounded border-2 font-semibold"
                        value={input}
                        onChange={e => /^\d*$/.test(e.target.value) && setInput(e.target.value)}
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
            <Separator />
        </>
    )
}

export default BarcodeScanningSection
