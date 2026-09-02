import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { buildApp } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

const app = buildApp();

const testEmail = `luiz-${Date.now()}@example.com`;
const testPassword = '12345678';

beforeAll( async () => {
    await app.ready();
})

afterAll(async () => {
    await prisma.user.deleteMany({
        where: {
            email: testEmail,
        },
    })

    await app.close();
    await prisma.$disconnect();
})

describe('Authentication', () => {
    it('should create a new user', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/users',
            payload: {
                name: 'Luiz Teste',
                email: testEmail,
                password: testPassword,
            },
        })

        expect(response.statusCode).toBe(201);

        const body = response.json();

        expect(body).toEqual(
            expect.objectContaining({
                name: 'Luiz Teste',
                email: testEmail,
                role: 'USER',
            }),
        )
        expect(body.passwordHash).toBeUndefined();
    })

    it('should not create a user with duplicated email', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'Luiz Teste',
        email: testEmail,
        password: testPassword,
      },
    })

    expect(response.statusCode).toBe(409)

    expect(response.json()).toEqual({
      message: 'Email already in use',
    })
  })

  it('should authenticate with valid credentials', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/sessions',
      payload: {
        email: testEmail,
        password: testPassword,
      },
    })

    expect(response.statusCode).toBe(200)

    const body = response.json()

    expect(body.accessToken).toBeDefined()

    expect(body.user).toEqual(
      expect.objectContaining({
        email: testEmail,
        role: 'USER',
      }),
    )
  })

  it('should reject invalid credentials', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/sessions',
      payload: {
        email: testEmail,
        password: 'senha-incorreta',
      },
    })

    expect(response.statusCode).toBe(401)

    expect(response.json()).toEqual({
      message: 'Invalid email or password',
    })
  })

  it('should access /me with a valid token', async () => {
    const loginResponse = await app.inject({
      method: 'POST',
      url: '/sessions',
      payload: {
        email: testEmail,
        password: testPassword,
      },
    })

    const { accessToken } = loginResponse.json()

    const response = await app.inject({
      method: 'GET',
      url: '/me',
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })

    expect(response.statusCode).toBe(200)

    expect(response.json()).toEqual(
      expect.objectContaining({
        name: 'Luiz Teste',
        email: testEmail,
        role: 'USER',
        active: true,
      }),
    )
  })

  it('should reject access to /me without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/me',
    })

    expect(response.statusCode).toBe(401)

    expect(response.json()).toEqual({
      message: 'Unauthorized',
    })
  })

  it('should reject invalid user payload', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'Lu',
        email: 'invalid-email',
        password: '123',
      },
    })

    expect(response.statusCode).toBe(400)

    const body = response.json()

    expect(body.message).toBe('Validation error')
    expect(body.issues).toBeDefined()
  })
})