import {
    BadRequestException,
    Controller,
    Get,
    HttpStatus,
    NotFoundException,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import {
    Request,
    Response,
} from 'express';

import {AuthService} from '../../../modules/login/services/auth.serviece';
import {AuthGuard} from '../../../modules/login/guards/auth.guard';
import {IUser} from '../../../modules/shared/types/types';

@Controller({
    path: 'user',
})
export class UserController {

    constructor(
        protected readonly authService: AuthService,
    ) {}

    @Get('info')
    @UseGuards(AuthGuard)
    public async getInfo(
        @Req() request: Request,
        @Res() response: Response,
    ): Promise<unknown> {
        const authorization = request.headers.authorization;
        if (!authorization) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: ['Access token not found'],
                error: 'Access token not found',
            });
        }

        const user = await this.authService.getUser({accessToken: authorization});
        if (!user) {
            throw new NotFoundException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: ['User not found'],
                error: 'User not found',
            });
        }

        const {firstName, lastName, sex} = user.userInfo;
        const data: Partial<IUser> = {
            login: user.login,
            firstName,
            lastName,
            sex,
        };

        return response.status(HttpStatus.OK)
            .send({
                statusCode: HttpStatus.OK,
                message: ['ok'],
                data,
            })
            .end();
    }
}
