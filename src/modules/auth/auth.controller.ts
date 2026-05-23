import type { Request, Response } from "express"
import { sendErrorResponce, sendResponce } from "../../utility/semdResponce"
import { authService } from "./auth.service"

const userSignup = async (req: Request, res: Response) =>{
    try {

        const result = await authService.signUpUserIntoDB(req.body)
        
        sendResponce(res, 201, 'User registered successfully', result)

    } catch (error : any) {
        sendErrorResponce(res, 500, error.message || 'Something went wrong', error)
    }
}

export const authController = {
    userSignup
}