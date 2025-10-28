import { ChangeEvent, useId } from 'react'
import { toast } from 'react-toastify'
import { Upload } from 'lucide-react'
import toastConfig from '@/configs/toast'

type ChatImageUploaderProps = {
    setImage: (image: string) => void
}

const ChatImageUploader = ({ setImage }: ChatImageUploaderProps) => {
    const inputId = useId()
    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !file.type.startsWith('image/')) {
            toast('Vui lòng chọn file hình ảnh.', toastConfig('info'))
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => setImage(reader.result as any)
        reader.readAsDataURL(file)
    }

    return (
        <div className="bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-md border shadow-xs">
            <label htmlFor={inputId} className="cursor-pointer px-3 py-2">
                <Upload size={18} />
            </label>

            <input type="file" name="image" id={inputId} accept="image/*" className="hidden" onChange={handleUpload} />
        </div>
    )
}

export default ChatImageUploader
