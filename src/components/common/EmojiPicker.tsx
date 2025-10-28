import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

type EmojiPickerProps = {
    theme?: 'light' | 'dark'
    onSelect: (emoji: string) => void
}

export const EmojiPicker = ({ onSelect, theme = 'light' }: EmojiPickerProps) => {
    return (
        <div className="absolute right-0 bottom-full z-50 mb-2">
            <Picker
                data={data}
                onEmojiSelect={(emoji: any) => onSelect(emoji.native)}
                theme={theme}
                previewPosition="none"
                locale="vi"
            />
        </div>
    )
}
