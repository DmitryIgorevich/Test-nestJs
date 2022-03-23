import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';

import {SharedModule} from '../shared/shared.module';
import {AuthController} from './controllers/auth.controller';
import {UserExistsMiddleWare} from './middleware/register/user-exists.middleware';
import {RegisterRequiredMiddleWare} from './middleware/register/validator-required.middleware';

@Module({
    imports: [
        SharedModule,
    ],
    controllers: [
    ],
    providers: [
        AuthController,
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
