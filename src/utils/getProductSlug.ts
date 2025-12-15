import slugify from 'slugify'

const slugifyConfig = {
    replacement: '-',
    lower: true,
    strict: false,
    locale: 'vi'
}

export const getProductSlug = (productName: string) => {
    return slugify(productName, slugifyConfig)
}
