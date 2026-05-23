import type { Request } from "express"
import type { IIssue } from "./issue.interface"
import { pool } from "../../db"

const addIssueIntoDB = async ( req : Request, payload : IIssue) => {
    const { title, description, type } = payload
    const reporter_id = req.user?.id as number

    const query = `INSERT INTO issues (title, description, type, reporter_id) VALUES ($1, $2, $3, $4) RETURNING *`

    const result = await pool.query(query, [title, description, type, reporter_id])

    return result.rows[0]
    
}

export const issueService = {
    addIssueIntoDB
}