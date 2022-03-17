import {
    Body,
    Controller,
    Get,
    Inject,
    Post,
} from '@nestjs/common';
import {AuthDTO} from '../dto/auth';

import {AuthService} from '../services/auth.serviece';

@Controller({
    path: 'auth',
})
export class AuthController {

    constructor(
        @Inject(AuthService) private readonly authService: AuthService,
    ) {
    }

    @Get()
    public async login(): Promise<any> {
        return 1;
    }

    @Post()
    public async register(
        @Body() body: AuthDTO,
    ): Promise<AuthDTO> {
        return await this.authService.register(body);
    }
}
