export type PresentationSemester = {
    id: number,
    semester: string,
    preevaluationDate: string | null,
    evaluationDate: string | null
}

export type CreatePresentationSemester = {
    semester: string,
    preevaluationDate: string,
    evaluationDate: string
}

// Either date can be sent on its own, the one left out keeps its current value
export type UpdatePresentationSemester = {
    preevaluationDate?: string,
    evaluationDate?: string
}
