import {
    Prop,
    Schema,
    SchemaFactory,
} from '@nestjs/mongoose';

@Schema()
export class AuthDTO {
    @Prop()
    public password: string;

    @Prop()
    public login: string;
}

export const AuthSchema = SchemaFactory.createForClass(AuthDTO);
