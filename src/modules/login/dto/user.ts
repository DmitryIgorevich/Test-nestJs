import {
    Prop,
    Schema,
    SchemaFactory,
} from '@nestjs/mongoose';

export interface IAuthDTO {
    password: string;
    login: string;
    firstName?: string;
    lastName?: string;
    sex?: 'mail' | 'female';
}

export interface IUserDTO extends IAuthDTO {
    id?: unknown;
}

@Schema()
export class UserDTO implements IUserDTO {
    @Prop()
    public password: string;

    @Prop()
    public login: string;

    @Prop()
    public accessToken: string;

    @Prop()
    public refreshToken: string;

    @Prop({type: String})
    public firstName?: string | undefined;

    @Prop({type: String})
    public lastName?: string | undefined;

    @Prop({type: String})
    public sex?: 'mail' | 'female';
}

export const UserSchema = SchemaFactory.createForClass(UserDTO);
