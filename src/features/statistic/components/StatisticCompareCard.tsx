import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

type StatisticCompareCardProps = {
    currValue: number
    prevValue: number
    label?: string
    unit?: string
    loading?: boolean
    to: string
}

const StatisticCompareCard = ({ currValue, prevValue, label, unit, loading, to }: StatisticCompareCardProps) => {
    const navigate = useNavigate()
    const [count, setCount] = useState(0)
    const percentGrowth = useMemo(
        () => (((currValue - prevValue) / prevValue) * 100).toFixed(2),
        [prevValue, currValue]
    )
    const isIncreasing = useMemo(() => parseFloat(percentGrowth) > 0, [percentGrowth])

    useEffect(() => {
        const speed = 100
        let from = 0
        const step = currValue / speed
        const counter = setInterval(function () {
            from += step
            if (from > currValue) {
                clearInterval(counter)
                setCount(currValue)
            } else {
                setCount(Math.ceil(from))
            }
        }, 1)

        return () => clearInterval(counter)
    }, [currValue])

    return (
        <div
            className="border-primary bg-card flex min-h-[150px] cursor-pointer items-center gap-4 rounded-lg border-3 p-6 shadow-md"
            onClick={() => navigate(to)}
        >
            <div className="bg-primary flex aspect-square w-10 items-center justify-center rounded-lg">
                {isIncreasing ? <TrendingUp /> : <TrendingDown />}
            </div>
            {loading ? (
                <Skeleton className="h-full w-full rounded-xl" />
            ) : (
                <div className="text-card-foreground flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2 text-3xl">
                        <strong>{count ? count.toLocaleString('en-US') : 0}</strong>
                        {unit && <strong>{unit}</strong>}
                        {prevValue > 0 && (
                            <span className={`text-xl font-bold ${isIncreasing ? 'text-success' : 'text-destructive'}`}>
                                ({isIncreasing ? '+' : ''}
                                {percentGrowth}%)
                            </span>
                        )}
                    </div>
                    <p className="text-muted-foreground text-lg font-medium">{label}</p>
                </div>
            )}
        </div>
    )
}

export default StatisticCompareCard
