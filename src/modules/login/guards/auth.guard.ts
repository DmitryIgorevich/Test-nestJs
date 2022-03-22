import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import {Request} from 'express';
import * as jsonwebtoken from 'jsonwebtoken';

import {decodeJwtKey} from '../../../system/app/secret.key';
import {AuthService} from '../services/auth.serviece';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly authService: AuthService,
    ) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();

        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: ['Access token not found'],
                error: 'Access token not found',
            });
        }

        const user = await this.authService.getUser({accessToken});
        if (!user) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: ['User not found by access token'],
                error: 'User not found by access token',
            });
        }

        const decodedAccessToken = decodeJwtKey(user.accessToken) as jsonwebtoken.JwtPayload;
        if (this.authService.checkExpiringJwtKey(decodedAccessToken)) {
            throw new UnauthorizedException({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: ['Time is end'],
                error: 'Time is end',
            });
        }

        return true;
    }
}
