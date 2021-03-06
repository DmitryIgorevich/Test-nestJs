import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpStatus,
    NotFoundException,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import {
    Request,
    Response,
} from 'express';
import * as jsonwebtoken from 'jsonwebtoken';

import {HEADERS} from '../../../system/app/common-header.names';
import {COOCKIE} from '../../../system/app/common-coockie.names';
import {IAuthDTO, IUserDTO} from '../dto/user';

import {decodeJwtKey} from '../../../system/app/secret.key';
import {AuthService} from '../services/auth.serviece';
import {CoockieHelper} from '../../../modules/app/helpers/coockie.helper';
import {AuthGuard} from '../guards/auth.guard';

@Controller({
    path: 'auth',
})
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('login')
    public async loginPost(
        @Req() request: Request,
        @Res() res: Response,
    ): Promise<any> {
        const body: IAuthDTO = request.body;
        const user = await this.authService.login(body);

        if (!user) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: [`User ${body.login} is not registered`],
                error: 'User is not registered',
            });
        }

        return res.status(HttpStatus.OK)
            .setHeader(HEADERS.AUTHORIZATION, user.accessToken)
            .cookie(COOCKIE.REFRESH_TOKEN, user.refreshToken, {
                httpOnly: true,
            })
            .send({
                statusCode: HttpStatus.OK,
                message: ['Login is succefully'],
            })
            .end();
    }

    @Get('refresh')
    public async refresh(
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<unknown> {
        if (!req.headers.cookie) {
            throw new NotFoundException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: ['Refresh token not found'],
                error: 'Refresh token not found',
            });
        }

        const refreshCoockie = CoockieHelper.findCoockieBy(req.headers.cookie, COOCKIE.REFRESH_TOKEN);
        const refreshToken = CoockieHelper.getCoockieValue(refreshCoockie, COOCKIE.REFRESH_TOKEN);
        if (!refreshToken) {
            throw new NotFoundException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: ['Refresh token not found'],
                error: 'Refresh token not found',
            });
        }

        const user = await this.authService.getUser({refreshToken});
        if (!user) {
            throw new NotFoundException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: ['User not found'],
                error: 'User not found',
            });
        }

        const decodedRefreshToken = decodeJwtKey(user.accessToken) as jsonwebtoken.JwtPayload;
        if (this.authService.checkExpiringJwtKey(decodedRefreshToken)) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: ['You should login again'],
                error: 'You should login again',
            });
        }

        const newUser = await this.authService.refreshToken(refreshToken);
        if (newUser) {
            return res.status(HttpStatus.OK)
                .setHeader(HEADERS.AUTHORIZATION, newUser.accessToken)
                .cookie(COOCKIE.REFRESH_TOKEN, newUser.refreshToken)
                .send({
                    statusCode: HttpStatus.OK,
                    message: ['Access token is refreshed'],
                })
                .end();
        }

        throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            message: ['You should login again'],
            error: 'You should login again',
        });
    }

    @Post('registration')
    public async register(
        @Res() response: Response,
        @Body() body: IAuthDTO,
    ): Promise<void> {
        const result = await this.authService.register(body);

        const data: Partial<IUserDTO> = {
            firstName: result.firstName,
            lastName: result.lastName,
            sex: result.sex,
            login: result.login,
            id: result._id,
        };

        response.status(HttpStatus.CREATED)
            .setHeader(HEADERS.AUTHORIZATION, result.accessToken)
            .cookie(COOCKIE.REFRESH_TOKEN, result.refreshToken, {
                httpOnly: true,
            })
            .send({
                statusCode: HttpStatus.CREATED,
                message: [`User ${result.login} is registered`],
                data,
            })
            .end();
    }

    @Get('test/:id')
    @UseGuards(AuthGuard)
    public async test(
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<any> {

        res.end();
    }

}
