import { createContext, ReactNode, useContext } from 'react'
import { useTheme } from '@/hooks/useTheme'

const ThemeContext = createContext<ReturnType<typeof useTheme> | null>(null)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const theme = useTheme()

    return <ThemeContext.Provider value={{ ...theme }}>{children}</ThemeContext.Provider>
}

export const useThemeContext = () => {
    const context = useContext(ThemeContext)
    if (!context) throw new Error('useThemeContext must be used within a ThemeProvider')

    return context
}
