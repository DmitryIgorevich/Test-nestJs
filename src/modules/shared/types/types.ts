import {IAuthDTO} from '../../../modules/login/dto/auth';
import {IUserDTO} from '../../../modules/user/dto/user.dto';

export interface IUser extends IAuthDTO, IUserDTO {}
