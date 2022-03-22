import {
    Injectable,
    NestMiddleware,
} from '@nestjs/common';
import {
    Request,
    Response,
} from 'express';

import {TKeys} from '../../../../system/types';

import {AuthDTO} from '../../dto/auth';
import {AuthService} from '../../services/auth.serviece';

const keys: TKeys<AuthDTO> = ['login', 'password'];

@Injectable()
export class RegisterRequiredMiddleWare implements NestMiddleware {

    constructor(
        protected authService: AuthService,
    ) {}

    public async use(req: Request, res: Response, next: (error?: any) => void) {
        const body: AuthDTO = req.body;
        const errorsFields: string[] = [];
        let error = false;

        keys.forEach(item => {
            if (body[item] === undefined) {
                error = true;
                errorsFields.push(item);
            }
        });

        if (error) {
            res.status(400)
                .send({
                    statusCode: 400,
                    message: this.generateErrorsMessages(errorsFields),
                })
                .end();

            return;
        }

        next();
    }

    protected generateErrorsMessages(errors: string[]): any {
        return errors.map(item => {
            return {[item]: `Field ${item} is required`};
        });
    }
}
