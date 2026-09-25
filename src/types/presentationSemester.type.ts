export type PresentationSemester = {
    id: number,
    semester: string,
    date: string | null
}

export type CreatePresentationSemester = {
    semester: string,
    date: string
}

export type UpdatePresentationSemester = {
    date: string
}
