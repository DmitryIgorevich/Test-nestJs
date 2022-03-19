import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import {
    Request,
    Response,
} from 'express';

import {REFRESH_TOKEN, REFRESH_TOKEN_COOCKIE} from '../../../system/app/common-coockie.names';
import {IAuthDTO} from '../dto/auth';

import {AuthService} from '../services/auth.serviece';

@Controller({
    path: 'auth',
})
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) {
    }

    @Post('login')
    public async loginPost(): Promise<any> {
        return 1;
    }

    @Get('login')
    public async loginGet(): Promise<any> {
        return 1;
    }

    @Get('refresh')
    public async refresh(
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<unknown> {
        const coockies = req.headers.cookie?.split(' ');
        const refreshCoockie = coockies?.find(item => {
            return item.includes(REFRESH_TOKEN_COOCKIE);
        });
        const refreshToken = refreshCoockie?.replace(REFRESH_TOKEN_COOCKIE, '');

        if (!refreshToken) {
            return res.status(401)
                .send({
                    statusCode: 401,
                    message: ['Some error with refresh token'],
                })
                .end();
        }

        const user = await this.authService.refreshToken(refreshToken);

        console.log(refreshToken);

        if (user) {
            return res.status(200)
                .send({
                    statusCode: 200,
                    message: ['Access token is refreshed'],
                })
                .end();
        }

        return res.send(401)
            .send({
                statusCode: 401,
                message: ['You should login again'],
            })
            .end();
    }

    @Post('registration')
    public async register(
        @Res() response: Response,
        @Body() body: IAuthDTO,
    ): Promise<void> {
        const result = await this.authService.register({
            response,
            body,
        });

        response.status(201)
            .setHeader('Authorization', result.accessToken)
            .cookie(REFRESH_TOKEN, result.refreshToken, {
                httpOnly: true,
            })
            .send({
                statusCode: 201,
                message: [`User ${result.login} is registered`],
            })
            .end();
    }

    @Get('test')
    public async test(): Promise<any> {
        return 1;
    }
}
