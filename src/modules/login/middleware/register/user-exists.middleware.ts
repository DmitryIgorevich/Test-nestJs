import {
    Injectable,
    NestMiddleware,
} from '@nestjs/common';
import {
    Request,
    Response,
} from 'express';

import {AuthDTO} from '../../dto/auth';
import {AuthService} from '../../services/auth.serviece';

@Injectable()
export class UserExistsMiddleWare implements NestMiddleware {
    constructor(
        protected authService: AuthService,
    ) {}

    public async use(req: Request, res: Response, next: (error?: any) => void) {
        const data: AuthDTO = req.body;
        const result = await this.authService.isUserExists(data.login);

        if (result) {
            res.status(400)
                .send({
                    message: `User ${data.login} is registred`,
                })
                .end();

            return;
        }

        next();
    }
}
