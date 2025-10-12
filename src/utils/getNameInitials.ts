// // Use the first letters of the last nth words in name
// // Eg: "Nguyễn Văn A" => "VA"
export const getNameInitials = (name: string, length: number = 2) => {
    if (!name || length < 1) return ''

    return name
        .split(' ')
        .slice(0, length)
        .map(str => str[0])
        .join('')
}
