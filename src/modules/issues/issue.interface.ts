interface IIssue{
    title: string
    description: string
    type: string
}

interface IIssueFromDB extends IIssue{
    id: number
    reporter_id: number
    status: string
    created_at: Date
    updated_at: Date
}

export type {
    IIssue,
    IIssueFromDB
}