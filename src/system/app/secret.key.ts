import * as jsonwebtoken from 'jsonwebtoken';

export const SECRET_KEY = 'SECRET_KEY';

const defaultSettings: jsonwebtoken.SignOptions = {
    expiresIn: 60 * 15,
};

export function generateJwtKey<T extends string | Buffer | object>(payload: T, options: jsonwebtoken.SignOptions = defaultSettings): string {
    return jsonwebtoken.sign(payload, SECRET_KEY, options);
}

export function decodeJwtKey(token: string): null | jsonwebtoken.JwtPayload | string {
    return jsonwebtoken.decode(token);
}
