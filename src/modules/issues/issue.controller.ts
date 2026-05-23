import type { Request, Response } from "express"
import { sendErrorResponce, sendResponce } from "../../utility/semdResponce"
import { issueService } from "./issue.service"

const createIssue = async (req: Request, res: Response) => {
    try {

        const result = await issueService.addIssueIntoDB(req, req.body)
        
        sendResponce(res, 201, 'Issue created successfully', result)
        
    } catch (error : any) {
        sendErrorResponce(res, 500, 'Failed to create issue', error.message)
    }
}

export const issueController = {
    createIssue
}