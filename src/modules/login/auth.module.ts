import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {AuthController} from './controllers/auth.controller';

import {AuthTokenMiddleWare} from './middleware/auth/auth.middleware';
import {UserExistsMiddleWare} from './middleware/register/user-exists.middleware';
import {RegisterRequiredMiddleWare} from './middleware/register/validator-required.middleware';
import {AccesssTokenMiddleWare} from './middleware/access/access.middleware';

import {AuthService} from './services/auth.serviece';

import {
    AuthDTO,
    AuthSchema,
} from './dto/auth';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: AuthDTO.name,
                schema: AuthSchema,
            },
        ]),
    ],
    controllers: [
        AuthController,
    ],
    providers: [
        AuthService,
    ],
    exports: [
    ],
})
export class AuthModule implements NestModule {

    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                AccesssTokenMiddleWare,
            )
            .forRoutes('auth')

            .apply(
                AuthTokenMiddleWare,
            )
            .forRoutes({
                path: 'auth/login',
                method: RequestMethod.GET,
            })

            .apply(
                RegisterRequiredMiddleWare,
                UserExistsMiddleWare,
            )
            .forRoutes({
                path: 'auth/registration',
                method: RequestMethod.POST,
            });
    }
}
