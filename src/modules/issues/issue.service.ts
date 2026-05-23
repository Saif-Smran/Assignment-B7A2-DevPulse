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

const getIssueByIdFromDB = async (id: string) => {

    // GET ISSUE
    const issueQuery = `
        SELECT * FROM issues
        WHERE id = $1
    `;

    const issueResult = await pool.query(issueQuery, [id]);

    const issue = issueResult.rows[0];

    // ISSUE NOT FOUND
    if (!issue) {
        return null;
    }

    // GET REPORTER
    const reporterQuery = `
        SELECT id, name, role
        FROM users
        WHERE id = $1
    `;

    const reporterResult = await pool.query(
        reporterQuery,
        [issue.reporter_id]
    );

    const reporter = reporterResult.rows[0];

    // FINAL RESPONSE
    return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,

        reporter: reporter,

        created_at: issue.created_at,
        updated_at: issue.updated_at
    };
};

const updateIssueByIdInDB = async ( req: Request,id: string, payload: Partial<IIssue>) => {
    const { title, description, type, status } = payload

    const role = req.user?.role

    if (role === 'contributor') {
        const result = await pool.query(`SELECT status FROM issues WHERE id = $1`, [id]);
        const issue = result.rows[0];

        if (issue.status !== 'open') {
            throw new Error(`Issue is already ${issue.status} and cannot be updated by a contributor.`);
        }
    }

    const query = `UPDATE issues SET title = $1, description = $2, type = $3, status = COALESCE($4, status) WHERE id = $5 RETURNING *`
    const result = await pool.query(query, [title, description, type, status, id])

    return result.rows[0]
}

const DeleteIssueById = async (id: string) => {
    const query = `DELETE FROM issues WHERE id = $1`
    const result = await pool.query(query, [id])
    return result.rows[0]
}

export const issueService = {
    addIssueIntoDB,
    getAllIssuesFromDB,
    getIssueByIdFromDB,
    updateIssueByIdInDB,
    DeleteIssueById
}

