import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {UserDTO} from '../../modules/login/dto/user';
import {SchemaHelper} from '../helpers/schema.helper';

export abstract class AbstractUserService {

    constructor(
        @InjectModel(UserDTO.name)
        protected readonly authModel: Model<UserDTO>,
    ) {}

    public async getUser(data: Partial<UserDTO>) {
        return await this.authModel.findOne(data);
    }

    public async getUserData(data: Partial<UserDTO>): Promise<UserDTO | undefined> {
        const user = await this.authModel.findOne(data);

        if (!user) {
            return;
        }

        return SchemaHelper.getData<UserDTO>(user);
    }
}
