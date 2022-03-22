import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {AuthController} from './controllers/auth.controller';

import {UserExistsMiddleWare} from './middleware/register/user-exists.middleware';
import {RegisterRequiredMiddleWare} from './middleware/register/validator-required.middleware';

import {AuthService} from './services/auth.serviece';
import {AuthGuard} from './guards/auth.guard';

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
        AuthGuard,
    ],
    exports: [
    ],
})
export class AuthModule implements NestModule {

    public configure(consumer: MiddlewareConsumer) {
        consumer
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
