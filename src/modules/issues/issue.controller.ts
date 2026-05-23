import type { Request, Response } from "express"
import { sendErrorResponce, sendResponce } from "../../utility/semdResponce"
import { issueService } from "./issue.service"

const createIssue = async (req: Request, res: Response) => {
    try {

        const result = await issueService.addIssueIntoDB(req, req.body)
        
        sendResponce(res, 201, 'Issue created successfully', result)
        
    } catch (error : any) {
        sendErrorResponce(res, 500, error.message || 'Failed to create issue', error)
    }
}

const getAllIssues = async (req: Request, res: Response) => {
    try {

        const result = await issueService.getAllIssuesFromDB(req)
        
        sendResponce(res, 200, 'Issues fetched successfully', result)
        
    } catch (error :any) {
        sendErrorResponce(res, 500,error.message || 'Failed to fetch issues', error)
    }
}

const GetIssueById = async (req: Request, res: Response) => {
    try {
        
        const { id } = req.params
        const result = await issueService.getIssueByIdFromDB(id as string)
        
        sendResponce(res, 200, 'Issue fetched successfully', result)

    } catch (error : any) {
        sendErrorResponce(res, 500,error.message || 'Failed to fetch issue', error)
    }
}

export const issueController = {
    createIssue,
    getAllIssues,
    GetIssueById
}