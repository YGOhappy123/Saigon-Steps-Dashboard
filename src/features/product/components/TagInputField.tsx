import { useEffect, useState } from 'react'
import { CirclePlus, CircleX } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type TagInputFieldProps = {
    label: string
    value: string[]
    onChange: (value: string[]) => void
    editable?: boolean
    placeholder?: string
    className?: string
    errorMessage?: string
    tagBackgroundColor?: string
    tagTextColor?: string
}

const TagInputField = ({
    label,
    value,
    onChange,
    editable = true,
    placeholder = 'Thêm thẻ...',
    className,
    errorMessage,
    tagBackgroundColor = 'bg-blue-100',
    tagTextColor = 'text-blue-600'
}: TagInputFieldProps) => {
    const [input, setInput] = useState('')
    useEffect(() => {
        setInput('')
    }, [editable])

    const handleAdd = () => {
        const trimmed = input.trim()
        if (!trimmed) return

        const exists = value.some(tag => tag.toLowerCase() === trimmed.toLowerCase())
        if (!exists) onChange([...value, trimmed])

        setInput('')
    }

    const handleRemove = (tag: string) => {
        onChange(value.filter(t => t !== tag))
    }

    return (
        <div className={twMerge('grid gap-2', className)}>
            <FormLabel className="text-card-foreground">{label}</FormLabel>

            <div className="flex flex-wrap gap-2">
                {value.map(tag => (
                    <div
                        key={tag}
                        className={twMerge(
                            `flex items-center gap-2 rounded-full px-4 py-1 select-none ${tagBackgroundColor}`
                        )}
                    >
                        <span className={twMerge(`font-semibold ${tagTextColor}`)}>{tag}</span>
                        {editable && (
                            <CircleX
                                className={twMerge(`cursor-pointer ${tagTextColor}`)}
                                onClick={() => handleRemove(tag)}
                            />
                        )}
                    </div>
                ))}
            </div>

            {editable && (
                <div className="flex items-center gap-2">
                    <Input
                        placeholder={placeholder}
                        className="caret-card-foreground text-card-foreground h-12 rounded border-2 font-semibold"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
                    />
                    <Button
                        type="button"
                        disabled={!input.trim()}
                        onClick={handleAdd}
                        className="aspect-square h-12 rounded text-base capitalize"
                    >
                        <CirclePlus />
                    </Button>
                </div>
            )}

            {errorMessage && <p className="text-destructive text-sm">{errorMessage}</p>}
        </div>
    )
}

export default TagInputField
