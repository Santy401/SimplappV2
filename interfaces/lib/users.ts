import { prisma } from './prisma';
import { User as Data } from '@/domain/entities/User.entity'

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                typeAccount: true,
                country: true,
            },
            orderBy: {
                id: 'desc'
            }
        });

        return users;
    } catch (error) {
        console.error('Error obteniendo usuarios de la DB:', error);
        throw error;
    }
}

export async function createUsers(User: Data) {
    try {
        const newUser = await prisma.user.create({
            data: {
                name: User.name,
                email: User.email,
                password: User.password,
                typeAccount: User.typeAccount,
                country: User.country,
            },
            select: {
                id: true,
                name: true,
                email: true,
                typeAccount: true,
                country: true,
            }
        })

        return newUser;
    } catch (error) {
        console.error('Error al crear usuario en la DB:', error);
        throw error;
    }
}