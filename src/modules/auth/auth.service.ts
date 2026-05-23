import bcrypt from "bcryptjs"
import { pool } from "../../db"
import type { IAuthSignup } from "./auth.interface"

const signUpUserIntoDB = async (payload : IAuthSignup) => {

    const { name, email, password, role } = payload

    const hashPassword = await bcrypt.hash(typeof password === 'number'
        ? String(password)
        : password, 10)
    
    const quary = `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *`

    const result = await pool.query(quary, [name, email, hashPassword, role])

    delete result.rows[0].password

    return result.rows[0]
}

export const authService = {
    signUpUserIntoDB
}