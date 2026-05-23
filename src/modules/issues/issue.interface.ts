interface IIssue{
    title: string
    description: string
    type: string
}

interface IIssueFromDB extends IIssue{
    id: string
    reporter_id: string
    status: string
    created_at: Date
    updated_at: Date
}

export type {
    IIssue,
    IIssueFromDB
}