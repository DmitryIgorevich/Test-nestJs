import {
    Prop,
    Schema,
    SchemaFactory,
} from '@nestjs/mongoose';

export interface IUserDTO {
    firstName?: string;
    lastName?: string;
    sex?: 'mail' | 'female';
}

@Schema()
export class UserDTO implements IUserDTO {
    @Prop()
    public firstName?: string;

    @Prop()
    public lastName?: string;

    @Prop()
    public sex?: 'mail' | 'female';
}

export const UserSchema = SchemaFactory.createForClass(UserDTO);
