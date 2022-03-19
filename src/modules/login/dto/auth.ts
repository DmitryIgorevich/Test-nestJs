import {
    Prop,
    Schema,
    SchemaFactory,
} from '@nestjs/mongoose';

export interface IAuthDTO {
    password: string;
    login: string;
}

@Schema()
export class AuthDTO implements IAuthDTO {
    @Prop()
    public password: string;

    @Prop()
    public login: string;

    @Prop()
    public accessToken: string;

    @Prop()
    public refreshToken: string;
}

export const AuthSchema = SchemaFactory.createForClass(AuthDTO);
