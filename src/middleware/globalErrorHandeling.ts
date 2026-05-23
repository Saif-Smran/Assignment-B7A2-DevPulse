import type { NextFunction, Request, Response } from "express";

import { sendErrorResponce } from "../utility/semdResponce";

const globalErrorHandeling = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error && err.name === 'TokenExpiredError') {
        return sendErrorResponce(res, 401, 'Unauthorized', 'Token has expired')
    }

    if (err instanceof Error && err.name === 'JsonWebTokenError') {
        return sendErrorResponce(res, 401, 'Unauthorized', err.message)
    }

    if (err instanceof Error) {
        console.error(err.stack); // Log the error
        return sendErrorResponce(res, 500, 'Something went wrong', err.message)
    }

   sendErrorResponce(res, 500, 'Something went wrong', 'Unknown error')
}

export default globalErrorHandeling;