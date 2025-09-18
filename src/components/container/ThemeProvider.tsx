import { createContext, ReactNode } from 'react'
import { useTheme } from '@/hooks/useTheme'

const ThemeContext = createContext<ReturnType<typeof useTheme> | null>(null)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const themeState = useTheme()

    return <ThemeContext.Provider value={themeState}>{children}</ThemeContext.Provider>
}
