import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';

import {AuthDTO} from '../dto/auth';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(AuthDTO.name) private authModel: Model<AuthDTO>,
    ) {}

    public async register(body: AuthDTO): Promise<any> {
        const user = await this.authModel.create(body);
        return user;
    }

    public async isUserExists(login: string): Promise<boolean> {
        return !!await this.authModel.findOne({login});
    }
}
