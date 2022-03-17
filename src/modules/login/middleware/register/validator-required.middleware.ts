import {
    Injectable,
    NestMiddleware,
} from '@nestjs/common';
import {
    Request,
    Response,
} from 'express';

import {
    IIndexing,
    TKeys,
} from '../../../../system/types';

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
        console.log('next');

        next();
    }

    protected generateErrorsMessages(errors: string[]): any {
        const res: IIndexing = {};
        errors.forEach(item => {
            res[item] = `Field ${item} is required`;
        });
        return res;
    }
}
