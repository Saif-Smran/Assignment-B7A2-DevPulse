import type { NextFunction, Request, Response } from "express";
import { sendErrorResponce } from "../utility/semdResponce";

const globalErrorHandeling = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // Log the error

   sendErrorResponce(res, 500, 'Something went wrong', err)
}

export default globalErrorHandeling;