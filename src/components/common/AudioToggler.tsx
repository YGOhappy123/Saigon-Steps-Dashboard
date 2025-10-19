import { Volume2, VolumeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAudioContext } from '@/components/container/AudioProvider'

const AudioToggler = () => {
    const { enableAudio, toggleEnableAudio, playMouseClickSound } = useAudioContext()

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => {
                playMouseClickSound(true)
                toggleEnableAudio()
            }}
        >
            {enableAudio === 'off' ? <Volume2 /> : <VolumeOff />}
        </Button>
    )
}

export default AudioToggler
