import { twMerge } from 'tailwind-merge'

type AppLogoProps = {
    reverse?: boolean
    className?: string
}

const AppLogo = ({ reverse = false, className }: AppLogoProps) => {
    return (
        <div
            className={twMerge(
                `flex items-center gap-2 px-2 ${reverse ? 'flex-row-reverse' : 'flex-row'} ${className}`
            )}
        >
            <div className="h-10 w-10">
                <img src="/images/no-text-logo.png" alt="Saigon Steps logo" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col items-center">
                <span className="text-sm font-bold tracking-wider text-nowrap text-[#f1bc58]">SAIGON STEPS</span>
                <span className="text-[10px] font-semibold tracking-widest text-nowrap text-[#e735af]">
                    WHERE STYLE BEGINS
                </span>
            </div>
        </div>
    )
}

export default AppLogo
