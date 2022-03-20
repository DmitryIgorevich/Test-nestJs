import {
    Injectable,
    NestMiddleware,
} from '@nestjs/common';
import {
    Request,
    Response,
} from 'express';
import * as jsonwebtoken from 'jsonwebtoken';

import {decodeJwtKey} from '../../../../system/app/secret.key';
import {AuthService} from '../../services/auth.serviece';

@Injectable()
export class AccesssTokenMiddleWare implements NestMiddleware {

    constructor(
        private readonly authService: AuthService,
    ) {
    }

    public async use(req: Request, res: Response, next: (error?: any) => void): Promise<unknown> {
        if (req.path.includes('registration') || req.path.includes('refresh')) {
            next();
            return;
        }

        const accessToken = req.headers.authorization;
        if (!accessToken) {
            return res.status(400)
                .send({
                    statusCode: 400,
                    message: ['Access token not found'],
                    error: 'Access token not found',
                })
                .end();
        }

        const user = await this.authService.getUserByAccessToken(accessToken);
        if (!user) {
            return res.status(400)
                .send({
                    statusCode: 400,
                    message: ['User not found by access token'],
                    error: 'User not found by access token',
                })
                .end();
        }

        const decodedAccessToken = decodeJwtKey(user.accessToken) as jsonwebtoken.JwtPayload;
        if (this.authService.checkExpiringJwtKey(decodedAccessToken)) {
            return res.status(401)
                .send({
                    statusCode: 401,
                    message: ['Time is end'],
                    error: 'Time is end',
                })
                .end();
        }

        return next();
    }
}
