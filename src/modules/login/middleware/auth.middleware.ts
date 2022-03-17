import {
    Injectable,
    NestMiddleware,
} from '@nestjs/common';

import {
    Request,
    Response,
} from 'express';

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
    constructor(
    ) {}

    public async use(req: Request, res: Response, next: (error?: any) => void) {
        next();
    }
}
