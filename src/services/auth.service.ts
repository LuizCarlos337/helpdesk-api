import argon2 from 'argon2';

import { UserRepository } from '../repositories/user.repository.js';

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
            throw new Error('Invalid email or password');
        }

        const passwordMatches = await argon2.verify(
            user.passwordHash,
            password
        )

        if(!passwordMatches) {
            throw new Error('Invalid email or password');
        }
        return user;
    }

}