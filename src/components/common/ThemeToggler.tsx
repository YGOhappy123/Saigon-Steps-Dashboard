import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useThemeContext } from '@/components/container/ThemeProvider'

const ThemeToggler = () => {
    const { theme, toggleTheme } = useThemeContext()

    return (
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun /> : <Moon />}
        </Button>
    )
}

export default ThemeToggler
