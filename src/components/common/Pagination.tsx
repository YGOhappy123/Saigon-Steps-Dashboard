import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type PaginationProps = {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

const ELLIPSES = '...'

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            pages.push(1)

            let start = Math.max(2, currentPage - 1)
            let end = Math.min(totalPages - 1, currentPage + 1)

            if (start > 2) pages.push(ELLIPSES)
            for (let i = start; i <= end; i++) pages.push(i)
            if (end < totalPages - 1) pages.push(ELLIPSES)

            pages.push(totalPages)
        }

        return pages
    }

    return (
        <div className="mt-4 flex items-center justify-center gap-2">
            <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageNumbers().map((p, idx) =>
                p === ELLIPSES ? (
                    <span key={idx} className="text-muted-foreground px-2">
                        {ELLIPSES}
                    </span>
                ) : (
                    <Button
                        key={p}
                        variant={p === currentPage ? 'default' : 'outline'}
                        className="h-10 w-10"
                        onClick={() => onPageChange(p as number)}
                    >
                        {p}
                    </Button>
                )
            )}

            <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
}

export default Pagination
