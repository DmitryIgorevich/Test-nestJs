import {
    Body,
    Controller,
    Get,
    Inject,
    Post,
    Res,
} from '@nestjs/common';
import {Response} from 'express';
import {IAuthDTO} from '../dto/auth';

import {AuthService} from '../services/auth.serviece';

@Controller({
    path: 'auth',
})
export class AuthController {

    constructor(
        @Inject(AuthService) private readonly authService: AuthService,
    ) {
    }

    @Get()
    public async login(): Promise<any> {
        return 1;
    }

    @Post()
    public async register(
        @Res() response: Response,
        @Body() body: IAuthDTO,
    ): Promise<void> {
        const result = await this.authService.register({
            response,
            body,
        });

        response
            .setHeader('Authorization', result.token)
            .send({
                login: result.login,
            })
            .end();
    }
}
