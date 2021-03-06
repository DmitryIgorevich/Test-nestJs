import {
    Injectable,
    NestMiddleware,
} from '@nestjs/common';
import {
    Request,
    Response,
} from 'express';

import {IUserDTO} from '../../dto/user';
import {AuthService} from '../../services/auth.serviece';

@Injectable()
export class UserExistsMiddleWare implements NestMiddleware {
    constructor(
        protected authService: AuthService,
    ) {}

    public async use(req: Request, res: Response, next: (error?: any) => void) {
        const data: IUserDTO = req.body;
        const result = await this.authService.isUserExists({login: data.login});

        if (result) {
            res.status(400)
                .send({
                    statusCode: 400,
                    message: `User ${data.login} already is registred`,
                })
                .end();

            return;
        }

        next();
    }
}
