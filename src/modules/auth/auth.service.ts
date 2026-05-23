import bcrypt from "bcryptjs"
import { pool } from "../../db"
import type { IAuthSignup, JWTPayload } from "./auth.interface"
import config from "../../config"
import jwt from "jsonwebtoken"

const signUpUserIntoDB = async (payload: IAuthSignup) => {

    const { name, email, password, role } = payload

    const hashPassword = await bcrypt.hash(typeof password === 'number'
        ? String(password)
        : password, 10)

    const quary = `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *`

    const result = await pool.query(quary, [name, email, hashPassword, role])

    delete result.rows[0].password

    return result.rows[0]
}

const loginUser = async ( payload : { email: string, password: string }) => {
    const { email, password } = payload
    const query = `SELECT * FROM users WHERE email = $1`
    const result = await pool.query(query, [email])

    if (result.rows.length === 0) {
        throw new Error('Invalid email or password')
    }

    const user = result.rows[0]
    const isMatch = await bcrypt.compare(password, user.password)

    const jwtPayload : JWTPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
    }

    const accessToken = jwt.sign(jwtPayload, config.jwtSecret, { expiresIn: '1d' })

    if (!isMatch) {
        throw new Error('Invalid email or password')
    }

    delete user.password
    return {
        token: accessToken,
        user
    }
}

export const authService = {
    signUpUserIntoDB,
    loginUser
}