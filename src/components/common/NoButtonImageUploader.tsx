import { ChangeEvent, useId } from 'react'
import { toast } from 'react-toastify'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { twMerge } from 'tailwind-merge'
import toastConfig from '@/configs/toast'

type NoButtonImageUploaderProps = {
    hasPermission: boolean
    image: string
    setImage: (image: string) => void
    originalImage: string
    shape?: 'circle' | 'square'
    allowDelete?: boolean
}

const NoButtonImageUploader = ({
    hasPermission,
    image,
    setImage,
    originalImage,
    shape = 'circle',
    allowDelete = false
}: NoButtonImageUploaderProps) => {
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

    const showReset = image !== originalImage
    const showDelete = allowDelete && hasPermission && !showReset && !!image

    return (
        <div className="flex w-full max-w-[150px] flex-col items-center justify-start gap-6">
            <div
                className={twMerge(
                    'group border-primary relative flex w-full items-center justify-center overflow-hidden border-4 p-1',
                    shape === 'circle' ? 'rounded-full' : 'rounded-xl'
                )}
            >
                <label
                    htmlFor={hasPermission ? inputId : undefined}
                    style={{
                        cursor: hasPermission ? 'pointer' : 'default'
                    }}
                >
                    <img
                        src={image || '/images/upload-icon.jpg'}
                        alt="image"
                        className={twMerge(
                            'aspect-square h-full w-full bg-white object-cover',
                            shape === 'circle' ? 'rounded-full' : 'rounded-lg'
                        )}
                    />
                </label>

                {hasPermission && (
                    <div className="pointer-events-none absolute inset-0 hidden flex-col items-center justify-center bg-black/30 text-white group-hover:flex">
                        <Upload />
                        <span>Tải ảnh lên</span>
                    </div>
                )}

                <input
                    type="file"
                    name="image"
                    id={inputId}
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                />
            </div>

            {showReset && (
                <Button type="button" variant="outline" onClick={() => setImage(originalImage)}>
                    Đặt lại ảnh cũ
                </Button>
            )}

            {showDelete && (
                <Button type="button" variant="destructive" onClick={() => setImage('')}>
                    Xóa ảnh
                </Button>
            )}
        </div>
    )
}

export default NoButtonImageUploader
