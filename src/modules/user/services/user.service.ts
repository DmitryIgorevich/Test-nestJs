import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {
    IUserDTO,
    UserDTO,
} from '../dto/user.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(UserDTO.name)
        private readonly userModel: Model<UserDTO>,
    ) {}

    public async createUserInfo(data: IUserDTO): Promise<UserDTO> {
        const values = {...data};

        if (data.sex !== 'female' && data.sex !== 'mail') {
            values.sex = undefined;
        }

        return await this.userModel.create(values);
    }
}
