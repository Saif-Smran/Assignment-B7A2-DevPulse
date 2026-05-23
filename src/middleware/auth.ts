import type { NextFunction, Request, Response } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { ROLES } from "../types";
import { sendErrorResponce, sendResponce } from "../utility/semdResponce";




const auth = (...roles: ROLES[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization

            if (!token) {
                return sendResponce(res, 401, 'Unauthorized', null)
            }

            const decode = jwt.verify(token as string, config.jwtSecret as string) as JwtPayload

            const userData = await pool.query('SELECT * FROM users WHERE email = $1', [decode.email])

            if (userData.rows.length === 0) {
                return sendErrorResponce(res, 401, 'Unauthorized', null)
            }

            if (roles.length && !roles.includes(userData.rows[0].role)) {
                return sendErrorResponce(res, 403, 'Forbidden: Insufficient permissions', null)
            }

            req.user = decode

            next()
        } catch (error) {
            next(error)
        }

    }
}

export default auth