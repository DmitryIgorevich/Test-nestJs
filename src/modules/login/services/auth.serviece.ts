import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Request, Response} from 'express';
import * as jsonwebtoken from 'jsonwebtoken';

import {
    AuthDTO,
    IAuthDTO,
} from '../dto/auth';

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
        const body = data.body || data.request?.body;

        const jwt = jsonwebtoken.sign(body, body.password, {
            expiresIn: 1000 * 60 * 60,
        });

        const user = await this.authModel.create(
            Object.assign({},
                body,
            <Partial<IAuthDTO>>{
                token: jwt,
            }),
        );

        return user;
    }

    public async isUserExists(login: string): Promise<boolean> {
        return !!await this.authModel.findOne({login});
    }

    public async checkAuthByToken(token: string): Promise<AuthDTO | null> {
        return await this.authModel.findOne({token});
    }
}
