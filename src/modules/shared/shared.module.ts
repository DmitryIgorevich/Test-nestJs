import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {AuthController} from '../login/controllers/auth.controller';
import {
    AuthDTO,
    AuthSchema,
} from '../login/dto/auth';
import {AuthGuard} from '../login/guards/auth.guard';
import {AuthService} from '../login/services/auth.serviece';
import {UserController} from '../user/controllers/user.controller';
import {
    UserDTO,
    UserSchema,
} from '../user/dto/user.dto';
import {UserService} from '../user/services/user.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: AuthDTO.name,
                schema: AuthSchema,
            },
        ]),
        MongooseModule.forFeature([
            {
                name: UserDTO.name,
                schema: UserSchema,
            },
        ]),
    ],
    controllers: [
        AuthController,
        UserController,
    ],
    providers: [
        AuthService,
        UserService,

        AuthGuard,
    ],
    exports: [
        AuthService,
        UserService,
    ],
})
export class SharedModule {}
