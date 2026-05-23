import type { Request } from "express"
import type { IIssue, IIssueFromDB } from "./issue.interface"
import { pool } from "../../db"

const addIssueIntoDB = async (req: Request, payload: IIssue) => {
    const { title, description, type } = payload
    const reporter_id = req.user?.id as number

    const query = `INSERT INTO issues (title, description, type, reporter_id) VALUES ($1, $2, $3, $4) RETURNING *`

    const result = await pool.query(query, [title, description, type, reporter_id])

    return result.rows[0]

}

const getAllIssuesFromDB = async (req: Request) => {

    const {
        sort = 'newest',
        type,
        status
    } = req.query;

    let query = `SELECT * FROM issues`;
    const values: string[] = [];
    const conditions: string[] = [];

    // FILTER BY TYPE
    if (type) {
        values.push(type as string);
        conditions.push(`type = $${values.length}`);
    }

    // FILTER BY STATUS
    if (status) {
        values.push(status as string);
        conditions.push(`status = $${values.length}`);
    }

    // ADD WHERE
    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
    }

    // SORTING
    if (sort === 'oldest') {
        query += ` ORDER BY created_at ASC`;
    } else {
        query += ` ORDER BY created_at DESC`;
    }

    // GET ISSUES
    const issueResult = await pool.query(query, values);

    const issues = issueResult.rows;

    // GET REPORTER IDS
    const reporterIds = [
        ...new Set(issues.map(issue => issue.reporter_id))
    ];

    let reportersMap: Record<number, any> = {};

    // FETCH REPORTERS
    if (reporterIds.length > 0) {

        const reporterQuery = `
            SELECT id, name, role
            FROM users
            WHERE id = ANY($1)
        `;

        const reporterResult = await pool.query(
            reporterQuery,
            [reporterIds]
        );

        reportersMap = reporterResult.rows.reduce(
            (acc, reporter) => {
                acc[reporter.id] = reporter;
                return acc;
            },
            {} as Record<number, any>
        );
    }

    // ADD REPORTER OBJECT
    const formattedIssues = issues.map(issue => ({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,

        reporter: reportersMap[issue.reporter_id],

        created_at: issue.created_at,
        updated_at: issue.updated_at
    }));

    return formattedIssues;
};

export const issueService = {
    addIssueIntoDB,
    getAllIssuesFromDB
}
