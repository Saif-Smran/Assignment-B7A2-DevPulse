import type { Response } from "express"

const sendResponce = (res: Response, statusCode: number, message: string, data: any) => {

    res.status(statusCode).json({
        success: true,
        message: message,
        data: data
    })
}

const sendErrorResponce = (res: Response, statusCode: number, message: string, error: any) => {

    res.status(statusCode).json({
        success: false,
        message: message,
        error: error
    })
}

export { sendResponce, sendErrorResponce }