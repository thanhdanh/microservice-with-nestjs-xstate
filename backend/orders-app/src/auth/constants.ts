export const jwtConstants = {
    secret: 'secretKey',
};

export interface IJwtPayload {
    sub: number
    username: string
}

export interface ICredential {
    userId: number
    username: string
}