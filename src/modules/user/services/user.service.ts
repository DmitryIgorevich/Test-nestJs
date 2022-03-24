import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {
    IUserDTO,
    UserDTO,
} from '../../login/dto/user';
import {AbstractUserService} from '../../../system/abstract/abstract.user.service';

@Injectable()
export class UserService extends AbstractUserService {

    constructor(
        @InjectModel(UserDTO.name)
            userModel: Model<UserDTO>,
    ) {
        super(userModel);
    }

    public async patchUser(findUser: UserDTO, data: IUserDTO) {
        const newData: Partial<IUserDTO> = Object.assign({}, data);
        delete newData.password;

        return await this.authModel.findOneAndUpdate(findUser, newData, {
            new: true,
        });
    }
}
