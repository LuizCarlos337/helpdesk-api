import argon2 from 'argon2';

import { UserRepository } from '../repositories/user.repository.js';
import { AppError } from '../errors/app-error.js';

interface CreateUserInput {
    name: string
    email: string
    password: string
}

export class UserService {
    constructor (private readonly userRepository = new UserRepository()) 
    {}

    async create({
        name,
        email,
        password,
    }: CreateUserInput) {
        const existingUser = 
            await this.userRepository.findByEmail(email);

            if(existingUser) {
                throw new AppError('Email already in use', 409);
            }

        const passwordHash = await argon2.hash(password);

        return this.userRepository.create({
            name,
            email,
            passwordHash,
        })
    }
    async findById(id: string) {
        return this.userRepository.findById(id)
    }
}