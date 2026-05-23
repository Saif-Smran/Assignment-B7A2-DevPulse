interface IAuthSignup {
    name: string,
    email: string,
    password: string,
    role: string
}

interface JWTPayload {
    id: string,
    email: string,
    name: string,
    role: string
}

export type {
    IAuthSignup,
    JWTPayload
}