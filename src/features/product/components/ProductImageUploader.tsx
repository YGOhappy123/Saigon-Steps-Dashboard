import { ChangeEvent, useId } from 'react'
import { toast } from 'react-toastify'
import { Upload } from 'lucide-react'
import toastConfig from '@/configs/toast'

type ProductImageUploaderProps = {
    setImage: (image: string) => void
}

const ProductImageUploader = ({ setImage }: ProductImageUploaderProps) => {
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
        <div className="flex w-full flex-col items-center justify-start gap-6">
            <div className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl border-4 border-dashed border-[#50a0e0] p-1">
                <label
                    htmlFor={inputId}
                    style={{
                        cursor: 'pointer'
                    }}
                >
                    <img
                        src="/images/upload-icon.jpg"
                        alt="image"
                        className="aspect-square h-full w-full rounded-lg bg-white object-cover"
                    />
                </label>

                <div className="pointer-events-none absolute top-0 left-0 hidden h-full w-full flex-col items-center justify-center bg-black/30 text-white group-hover:flex">
                    <Upload />
                    <span>Tải ảnh lên</span>
                </div>

                <input
                    type="file"
                    name="image"
                    id={inputId}
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                />
            </div>
        </div>
    )
}

export default ProductImageUploader
