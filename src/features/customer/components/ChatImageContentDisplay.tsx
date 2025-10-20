import { useState } from 'react'
import { Eye } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogDescription,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

type ChatImageContentDisplayProps = {
    src: string
    alt?: string
}

const ChatImageContentDisplay = ({ src, alt = 'Message image content' }: ChatImageContentDisplayProps) => {
    const [open, setOpen] = useState(false)

    return (
        <div className="group relative overflow-hidden rounded-lg">
            <img src={src} alt={alt} className="max-h-[300px] max-w-[300px] object-contain" />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <div className="absolute inset-0 hidden cursor-pointer items-center justify-center gap-2 bg-black/30 text-white select-none group-hover:flex">
                        <Eye />
                        <span>Xem ảnh</span>
                    </div>
                </DialogTrigger>
                <DialogContent className="h-fit sm:max-w-[70vw] lg:max-w-[60vw]">
                    <DialogHeader>
                        <DialogTitle>Xem ảnh</DialogTitle>
                        <DialogDescription>Xem ảnh trong kích thước đầy đủ.</DialogDescription>
                    </DialogHeader>
                    <Separator />
                    <img src={src} alt={alt} className="mx-auto max-h-[70vh] max-w-full rounded-lg object-contain" />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ChatImageContentDisplay
