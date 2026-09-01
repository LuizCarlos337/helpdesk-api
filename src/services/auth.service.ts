import argon2 from 'argon2';

import { UserRepository } from '../repositories/user.repository.js';
import { AppError } from '../errors/app-error.js';

interface LoginInput {
    email: string
    password: string
}

export class AuthService {
    constructor(private readonly userRepository = new UserRepository()
    ) {}

    async authenticate({
        email,
        password,
    }: LoginInput) {
        const user = await this.userRepository.findByEmail(email);

        if(!user || !user.active) {
            throw new AppError('Invalid email or password', 401);
        }

        const passwordMatches = await argon2.verify(
            user.passwordHash,
            password
        )

        if(!passwordMatches) {
            throw new AppError('Invalid email or password', 401);
        }
        return user;
    }

}