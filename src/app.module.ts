import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {AppController} from './app.controller';
import {AuthModule} from './modules/login/auth.module';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb+srv://admin:admin@cluster0.kaabr.mongodb.net/project1?retryWrites=true&w=majority'),
        AuthModule,
    ],
    controllers: [
        AppController,
    ],
    providers: [
    ],
})
export class AppModule {}
