import {
    BadRequestException,
    Controller,
    Get,
    HttpStatus,
    NotFoundException,
    Patch,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import {
    Request,
    Response,
} from 'express';

import {AuthGuard} from '../../../modules/login/guards/auth.guard';
import {IUserDTO, UserDTO} from '../../../modules/login/dto/user';
import {UserService} from '../services/user.service';

@Controller({
    path: 'user',
})
export class UserController {

    constructor(
        protected readonly userService: UserService,
    ) {}

    @Get('info')
    @UseGuards(AuthGuard)
    public async getInfo(
        @Req() request: Request,
        @Res() response: Response,
    ): Promise<void> {
        const authorization = request.headers.authorization;
        if (!authorization) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: ['Access token not found'],
                error: 'Access token not found',
            });
        }

        const user = await this.userService.getUser({accessToken: authorization});
        if (!user) {
            throw new NotFoundException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: ['User not found'],
                error: 'User not found',
            });
        }

        const {login, firstName, lastName, sex, _id} = user;
        const data: Partial<IUserDTO> = {
            login,
            firstName,
            lastName,
            sex,
            id: _id,
        };

        response.status(HttpStatus.OK)
            .send({
                statusCode: HttpStatus.OK,
                message: ['ok'],
                data,
            })
            .end();
    }

    @Patch('info')
    @UseGuards(AuthGuard)
    public async patchInfo(
        @Req() request: Request,
        @Res() response: Response,
    ): Promise<void> {
        const accessToken = request.headers.authorization;
        if (!accessToken) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: ['No access token'],
                error: 'No access token',
            });
        }

        const user = await this.userService.getUserData({accessToken});
        if (!user) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: ['User not found by access token'],
                error: 'User not found by access token',
            });
        }

        const updatedUser = await this.userService.patchUser(user, request.body);
        if (!updatedUser) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: ['User not found by access token'],
                error: 'User not found by access token',
            });
        }

        const data: Partial<IUserDTO> = {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            login: updatedUser.login,
            sex: updatedUser.sex,
            id: updatedUser._id,
        };

        response.status(HttpStatus.OK)
            .send({
                statusCode: HttpStatus.OK,
                message: ['User is updated'],
                data,
            })
            .end();
    }
}
