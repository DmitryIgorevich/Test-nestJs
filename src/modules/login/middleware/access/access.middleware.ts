import {
    Injectable,
    NestMiddleware,
} from '@nestjs/common';
import {
    Request,
    Response,
} from 'express';
import * as jsonwebtoken from 'jsonwebtoken';

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
            return res.status(401)
                .send({
                    statusCode: 401,
                    message: ['Some error with access token'],
                })
                .end();
        }

        const user = await this.authService.getUserByAccessToken(accessToken);

        if (!user) {
            return res.status(401)
                .send({
                    statusCode: 401,
                    message: ['Some error with access token'],
                })
                .end();
        }

        const decodedAccessToken = jsonwebtoken.decode(user.accessToken) as jsonwebtoken.JwtPayload;

        if (decodedAccessToken.exp && Date.now() >= decodedAccessToken.exp) {
            return res.status(401)
                .send({
                    statusCode: 401,
                    message: ['Allowed time is gone'],
                })
                .end();
        }

        return next();
    }
}
