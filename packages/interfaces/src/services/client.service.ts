import { ClientRepository } from '../repositories/client.repository';

export class ClientService {
    /**
     * Lista clientes con paginación filtrados por compañía.
     */
    static async listClients(companyId: string, page = 1, limit = 10, search?: string) {
        const skip = (page - 1) * limit;
        const where: any = { companyId };

        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { firstLastName: { contains: search, mode: 'insensitive' } },
                { commercialName: { contains: search, mode: 'insensitive' } },
                { identificationNumber: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [data, total] = await Promise.all([
            ClientRepository.findAll(where, skip, limit),
            ClientRepository.count(where)
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    /**
     * Obtiene un cliente validando que pertenezca a la compañía.
     */
    static async getClientById(id: string, companyId: string) {
        const client = await ClientRepository.findById(id, companyId);
        if (!client) {
            throw new Error('Cliente no encontrado o no pertenece a esta compañía.');
        }
        return client;
    }

    /**
     * Crea un nuevo cliente con validaciones básicas.
     */
    static async createClient(data: any, companyId: string) {
        // Aquí se podrían añadir validaciones de negocio adicionales
        return ClientRepository.create({
            ...data,
            companyId
        });
    }
}
