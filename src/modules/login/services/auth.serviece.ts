import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import * as jsonwebtoken from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import {
    IUserDTO,
    UserDTO,
} from '../dto/user';
import {generateJwtKey} from '../../../system/app/secret.key';
import {AbstractUserService} from '../../../system/abstract/abstract.user.service';

@Injectable()
export class AuthService extends AbstractUserService {

    constructor(
        @InjectModel(UserDTO.name)
            authModel: Model<UserDTO>,
    ) {
        super(authModel);
    }

    public async login(body: IUserDTO): Promise<UserDTO | null> {
        const user = await this.getUser({login: body.login});

        if (!user) {
            return null;
        }

        if (!bcrypt.compareSync(body.password, user.password)) {
            return null;
        }

        const {password, login} = user;
        const accessToken = generateJwtKey<Partial<IUserDTO>>({login, password});
        const refreshToken = generateJwtKey<Partial<IUserDTO>>({login, password}, {
            expiresIn: 1 * 60 * 24 * 7,
        });

        return await this.authModel.findOneAndUpdate(
            {login},
            {refreshToken, accessToken},
            {new: true},
        );
    }

    public async register(body: IUserDTO) {
        const hashedPassword = bcrypt.hashSync(body.password, 10);
        const jwtAccess = generateJwtKey<Partial<IUserDTO>>({
            login: body.login,
            password: hashedPassword,
        });

        const jwtRefresh = generateJwtKey<Partial<IUserDTO>>(
            {
                login: body.login,
                password: hashedPassword,
            },
            {
                expiresIn: 1 * 60 * 24 * 7,
            },
        );

        return await this.authModel.create(Object.assign(
            {},
            body,
            <Partial<UserDTO>>{
                password: hashedPassword,
                accessToken: jwtAccess,
                refreshToken: jwtRefresh,
            },
        ));
    }

    public async isUserExists(data: Partial<UserDTO>): Promise<boolean> {
        return !!await this.getUser(data);
    }

    public async refreshToken(refreshToken: string): Promise<UserDTO | null> {
        const user = await this.getUser({refreshToken});

        if (!user) {
            return null;
        }

        const jwtAccess = generateJwtKey<Partial<IUserDTO>>(
            {login: user.login},
        );

        const jwtRefresh = generateJwtKey<Partial<IUserDTO>>(
            {login: user.login}, {
                expiresIn: 1 * 60 * 24 * 7,
            },
        );

        return await this.authModel.findOneAndUpdate(
            {refreshToken},
            <Partial<UserDTO>>{
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
