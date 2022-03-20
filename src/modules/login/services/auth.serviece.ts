import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {
    Request,
    Response,
} from 'express';
import * as jsonwebtoken from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

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

    public async login(data: IRequestParams<IAuthDTO>): Promise<AuthDTO | null> {
        const body: IAuthDTO = data.body || data.request?.body;
        const user = await this.getUser({login: body.login});

        if (!user) {
            return null;
        }

        if (!bcrypt.compareSync(body.password, user.password)) {
            return null;
        }

        const {password, login} = user;
        const accessToken = generateJwtKey<Partial<IAuthDTO>>({login, password});
        const refreshToken = generateJwtKey<Partial<IAuthDTO>>({login, password}, {
            expiresIn: 1 * 60 * 24 * 7,
        });

        return await this.authModel.findOneAndUpdate(
            {login},
            {refreshToken, accessToken},
            {new: true},
        );
    }

    public async register(data: IRequestParams<IAuthDTO>): Promise<AuthDTO> {
        const body: IAuthDTO = data.body || data.request?.body;

        const hashedPassword = bcrypt.hashSync(body.password, 10);
        const jwtAccess = generateJwtKey<Partial<IAuthDTO>>({
            login: body.login,
            password: hashedPassword,
        });

        const jwtRefresh = generateJwtKey<Partial<IAuthDTO>>({
            login: body.login,
            password: hashedPassword,
        }, {
            expiresIn: 1 * 60 * 24 * 7,
        });

        return await this.authModel.create(
            Object.assign({},
                body,
                <Partial<IAuthDTO>>{
                    password: hashedPassword,
                },
                <Partial<AuthDTO>>{
                    accessToken: jwtAccess,
                    refreshToken: jwtRefresh,
                },
            ),
        );
    }

    public async isUserExists(data: Partial<AuthDTO>): Promise<boolean> {
        return !!await this.getUser(data);
    }

    public async getUser(data: Partial<AuthDTO>): Promise<AuthDTO | null> {
        return await this.authModel.findOne(data);
    }

    public async refreshToken(refreshToken: string): Promise<AuthDTO | null> {
        const user = await this.getUser({refreshToken});

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

        return await this.authModel.findOneAndUpdate(
            {refreshToken},
            {
                refreshToken: jwtRefresh,
                accessToken: jwtAccess,
            },
            {new: true},
        );
    }

    public checkExpiringJwtKey(decodedAccessToken: jsonwebtoken.JwtPayload): boolean {
        return !!decodedAccessToken.exp && Date.now() / 1000 >= decodedAccessToken.exp;
    }
}
