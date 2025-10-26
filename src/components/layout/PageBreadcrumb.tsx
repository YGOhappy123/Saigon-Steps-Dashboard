import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { sidebarGroups } from '@/configs/sidebarGroups'
import { useIsMobile } from '@/hooks/useMobile'
import AudioToggler from '@/components/common/AudioToggler'
import ThemeToggler from '@/components/common/ThemeToggler'
import useTitle from '@/hooks/useTitle'

const PageBreadcrumb = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const { pathname } = useLocation()
    const isMobile = useIsMobile()

    const isExactMatch = (path?: string) => !!path && pathname === path
    const isPrefixMatch = (path?: string) => !!path && pathname.startsWith(path)

    const matchingGroup =
        sidebarGroups.find(group =>
            group.items.some(item => isExactMatch(item.url) || item.children?.some(child => isExactMatch(child.url)))
        ) ||
        sidebarGroups.find(group =>
            group.items.some(item => isPrefixMatch(item.url) || item.children?.some(child => isPrefixMatch(child.url)))
        )

    const matchingItem =
        matchingGroup?.items.find(
            item => isExactMatch(item.url) || item.children?.some(child => isExactMatch(child.url))
        ) ||
        matchingGroup?.items.find(
            item => isPrefixMatch(item.url) || item.children?.some(child => isPrefixMatch(child.url))
        )

    const matchingChild =
        matchingItem?.children?.find(child => isExactMatch(child.url)) ||
        matchingItem?.children?.find(child => isPrefixMatch(child.url))

    useTitle(`Saigon Steps Dashboard | ${matchingChild ? matchingChild.title : matchingItem?.title}`)

    return (
        <div className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
                {!isMobile && (
                    <>
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    </>
                )}
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink>{matchingGroup?.title}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />

                        {matchingChild ? (
                            <>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink>{matchingItem?.title}</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{matchingChild.title}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </>
                        ) : (
                            <BreadcrumbItem>
                                <BreadcrumbPage>{matchingItem?.title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        )}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {!isMobile && (
                <div className="flex items-center">
                    <AudioToggler />
                    <ThemeToggler />
                </div>
            )}
        </div>
    )
}

export default PageBreadcrumb
