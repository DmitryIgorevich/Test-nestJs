import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {
    Request,
    Response,
} from 'express';
import * as jsonwebtoken from 'jsonwebtoken';

import {
    AuthDTO,
    IAuthDTO,
} from '../dto/auth';
import {generateJwtKey} from '../../../system/app/secret.key';

export interface IRequestParams<T> {
    response?: Response;
    request?: Request;
    body?: T;
}

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(AuthDTO.name) private readonly authModel: Model<AuthDTO>,
    ) {}

    public async register(data: IRequestParams<IAuthDTO>): Promise<AuthDTO> {
        const body: IAuthDTO = data.body || data.request?.body;

        const jwtAccess = generateJwtKey<Partial<IAuthDTO>>(
            {login: body.login},
        );

        const jwtRefresh = generateJwtKey<Partial<IAuthDTO>>(
            {login: body.login}, {
                expiresIn: 1 * 60 * 24 * 7,
            },
        );

        return await this.authModel.create(
            Object.assign({},
                body,
                <Partial<AuthDTO>>{
                    accessToken: jwtAccess,
                    refreshToken: jwtRefresh,
                },
            ),
        );
    }

    public async isUserExists(login: string): Promise<AuthDTO | null> {
        return await this.authModel.findOne({login});
    }

    public async getUserByAccessToken(accessToken: string): Promise<AuthDTO | null> {
        return await this.authModel.findOne({accessToken});
    }

    public async getUser(data: Partial<AuthDTO>): Promise<AuthDTO | null> {
        return await this.authModel.findOne(data);
    }

    public async refreshToken(refreshToken: string): Promise<AuthDTO | null> {
        const user = await this.getUser({refreshToken});

        console.log('refreshToken user', user);
        if (!user) {
            return null;
        }

        const jwtAccess = generateJwtKey<Partial<IAuthDTO>>(
            {login: user.login},
        );
        const jwtRefresh = generateJwtKey<Partial<IAuthDTO>>(
            {login: user.login}, {
                expiresIn: 1 * 60 * 24 * 7,
            },
        );

        const modifiedUser = await this.authModel.findOneAndUpdate(
            {refreshToken},
            {
                refreshToken: jwtRefresh,
                accessToken: jwtAccess,
            },
            {new: true},
        );

        console.log('refesh user', user);
        console.log('refesh modifiedUser', modifiedUser);
        console.log(modifiedUser === user);

        return modifiedUser;
    }

    public checkExpiringJwtKey(decodedAccessToken: jsonwebtoken.JwtPayload): boolean {
        return !!decodedAccessToken.exp && Date.now() / 1000 >= decodedAccessToken.exp;
    }
}
