import { Account } from "./account.type"

export type Project = {
    id: number,
    name: string,
    status: string,
    presentationDate: string,
    coverImageUrl: string 
}

export type ProjectMembers = {
    id: number,
    name: string,
    advisor: Account,
    members: Account[],
    coverImageUrl: string 
}

export type CreateProject = {
    name: string,
    description: string,
    status: string,
    presentationDate: string,
    advisorId: string,
    modules: string []
}


