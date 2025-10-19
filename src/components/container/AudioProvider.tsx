import { createContext, ReactNode, useContext } from 'react'
import { useAudio } from '@/hooks/useAudio'

const AudioContext = createContext<ReturnType<typeof useAudio> | null>(null)

export const AudioProvider = ({ children }: { children: ReactNode }) => {
    const audio = useAudio()

    return <AudioContext.Provider value={{ ...audio }}>{children}</AudioContext.Provider>
}

export const useAudioContext = () => {
    const context = useContext(AudioContext)
    if (!context) throw new Error('useAudioContext must be used within a AudioProvider')

    return context
}
