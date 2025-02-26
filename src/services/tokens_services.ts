// src/services/TokenService.ts

import jwt, { JwtPayload } from 'jsonwebtoken';
import secretKey from '../private/secretKey.json';
import { PrismaClient } from '@prisma/client'; // Importa o PrismaClient
import { tokenSchema, emailSchema, dateSchema } from '../schemas/tokens_services_schemas'; // Importa os esquemas de validação
import DateFormatter from '../utils/date_formatter';

interface DecodedToken extends JwtPayload {
    id_user: number;
    photo: string;
    password: string;
    email: string;
    type: number; // Agora é um número, pois `type` é um `Int`
    access_level?: string;
}

class TokenService {
    private secretKey: string;
    private db: PrismaClient; // Define o tipo do db como PrismaClient

    constructor() {
        this.secretKey = secretKey.secretKey;
        this.db = new PrismaClient(); // Inicializa o PrismaClient
    }

    private async decodeToken(accessToken: string): Promise<DecodedToken | null> {
        try {
            const result = tokenSchema.parse({ accessToken }); // Valida o accessToken
            return jwt.verify(result.accessToken, this.secretKey) as DecodedToken;
        } catch (err) {
            console.error('Error decoding token:', err);
            return null;
        }
    }

    public async getUserProperty<T extends keyof DecodedToken>(
        accessToken: string,
        property: T
    ): Promise<DecodedToken[T] | -1> {
        const decodedToken = await this.decodeToken(accessToken);
        if (decodedToken === null) {
            return null;
        }

        // Certifique-se de que a propriedade retornada não é `undefined`
        const result = decodedToken[property];
        return result !== undefined ? result : -1;
    }

    public userId(accessToken: string): Promise<number | null> {
        return this.getUserProperty(accessToken, 'id_user') as Promise<number | null>;
    }

    public userType(accessToken: string): Promise<number | null> { // Agora retorna número
        return this.getUserProperty(accessToken, 'type') as Promise<number | null>;
    }

    public userAccessLevel(accessToken: string): Promise<string | null> {
        return this.getUserProperty(accessToken, 'access_level') as Promise<string | null>;
    }

    public userPhoto(accessToken: string): Promise<string | null> {
        return this.getUserProperty(accessToken, 'photo') as Promise<string | null>;
    }

    public userPassword(accessToken: string): Promise<string | null> {
        return this.getUserProperty(accessToken, 'password') as Promise<string | null>;
    }

    public userEmail(accessToken: string): Promise<string | null> {
        return this.getUserProperty(accessToken, 'email') as Promise<string | null>;
    }

    public async checkTokenUser(accessToken: string): Promise<boolean> {
        try {
            const decoded = await this.decodeToken(accessToken);
            if (decoded === null) {
                return false;
            }
            const user = await this.db.users.findUnique({
                where: { id_user: decoded.id_user }, // Usa id_user do token
                select: { id_user: true },   // Verifica a existência do id_user
            });
            return user !== null; // Retorna verdadeiro se o usuário existir
        } catch (err) {
            console.error('Error verifying user token:', err);
            return false;
        }
    }

    public async checkEmailUser(email: string): Promise<boolean> {
        try {
            // Validação do email
            const result = emailSchema.parse({ email });

            const user = await this.db.users.findUnique({
                where: { email: result.email }, // Busca pelo email
                select: { id_user: true }, // Verifica se o id_user existe
            });
            return user === null; // Retorna true se o email não existir
        } catch (err) {
            console.error('Error checking user email:', err);
            return false;
        }
    }

    public async checkDate(date: string): Promise<boolean> {
        try {
            // Validação da data
            const result = dateSchema.parse({ date });

            const dateNow = new DateFormatter().getFormattedDate();
            const expiresDate = new DateFormatter().formatDate(result.date);

            const inputDate = new Date(expiresDate);
            const currentDate = new Date(dateNow);

            return inputDate >= currentDate; // Retorna true se a data não estiver expirada
        } catch (err) {
            console.error('Error processing date:', err);
            return false;
        }
    }
}

export default TokenService;
