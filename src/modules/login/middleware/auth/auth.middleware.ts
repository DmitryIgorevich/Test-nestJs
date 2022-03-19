import {
    Injectable,
    NestMiddleware,
} from '@nestjs/common';

import {
    Request,
    Response,
} from 'express';

import {AuthService} from '../../services/auth.serviece';

@Injectable()
export class AuthTokenMiddleWare implements NestMiddleware {
    constructor(
        private readonly authService: AuthService,
    ) {}

    public async use(req: Request, res: Response, next: (error?: any) => void) {
        const headers = req.headers;

        if (headers.authorization) {
            const authorization = headers.authorization;
            const result = await this.authService.getUserByAccessToken(authorization);

            if (result) {
                res.status(200)
                    .cookie('Authorization', authorization)
                    .send({
                        statusCode: 200,
                        message: 'Access is done',
                    })
                    .end();
            }

            return;
        }

        next();
    }
}
