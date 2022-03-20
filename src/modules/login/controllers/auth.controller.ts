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
import * as jsonwebtoken from 'jsonwebtoken';

import {AUTHORIZATION} from '../../../system/app/common-header.names';
import {REFRESH_TOKEN} from '../../../system/app/common-coockie.names';
import {IAuthDTO} from '../dto/auth';

import {decodeJwtKey} from '../../../system/app/secret.key';
import {AuthService} from '../services/auth.serviece';
import {CoockieHelper} from '../../../modules/app/helpers/coockie.helper';

@Controller({
    path: 'auth',
})
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) {
    }

    @Post('login')
    public async loginPost(
        @Req() request: Request,
        @Res() res: Response,
    ): Promise<any> {
        const user = await this.authService.login({request});

        if (!user) {
            return res.status(400)
                .send({
                    statusCode: 400,
                    message: ['Wrong password or login'],
                    error: 'Wrong password or login',
                })
                .end();
        }

        return res.status(200)
            .setHeader(AUTHORIZATION, user.accessToken)
            .cookie(REFRESH_TOKEN, user.refreshToken, {
                httpOnly: true,
            })
            .send({
                statusCode: 200,
                message: ['Login is succefully'],
            })
            .end();
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
        if (!req.headers.cookie) {
            return res.status(400)
                .send({
                    statusCode: 400,
                    message: ['Refresh token not found'],
                    error: 'Refresh token not found',
                })
                .end();
        }

        const refreshCoockie = CoockieHelper.findCoockieBy(req.headers.cookie, REFRESH_TOKEN);
        const refreshToken = CoockieHelper.getCoockieValue(refreshCoockie, REFRESH_TOKEN);
        if (!refreshToken) {
            return res.status(400)
                .send({
                    statusCode: 400,
                    message: ['Refresh token not found'],
                    error: 'Refresh token not found',
                })
                .end();
        }

        const user = await this.authService.getUser({refreshToken});
        if (!user) {
            return res.status(400)
                .send({
                    statusCode: 400,
                    message: ['User by passed refresh token not found'],
                    error: 'User by passed refresh token not found',
                })
                .end();
        }

        const decodedRefreshToken = decodeJwtKey(user.accessToken) as jsonwebtoken.JwtPayload;
        if (this.authService.checkExpiringJwtKey(decodedRefreshToken)) {
            return res.status(400)
                .send({
                    statusCode: 400,
                    message: ['You should login again'],
                    error: 'You should login again',
                })
                .end();
        }

        const newUser = await this.authService.refreshToken(refreshToken);
        if (newUser) {
            return res.status(200)
                .setHeader(AUTHORIZATION, newUser.accessToken)
                .cookie(REFRESH_TOKEN, newUser.refreshToken)
                .send({
                    statusCode: 200,
                    message: ['Access token is refreshed'],
                })
                .end();
        }

        return res.status(400)
            .send({
                statusCode: 400,
                message: ['You should login again'],
                error: 'You should login again',
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
            .setHeader(AUTHORIZATION, result.accessToken)
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
