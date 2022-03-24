import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {AuthController} from '../login/controllers/auth.controller';
import {
    UserDTO,
    UserSchema,
} from '../login/dto/user';
import {AuthGuard} from '../login/guards/auth.guard';
import {AuthService} from '../login/services/auth.serviece';
import {UserController} from '../user/controllers/user.controller';
import {UserService} from '../user/services/user.service';

@Module({
    imports: [
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
