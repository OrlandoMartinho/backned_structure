import { prisma } from './prisma_client';
import admin_credentials from '../../private/admin_credentials.json';
import keysBd from '../../private/data_base_keys.json';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import secretKey from '../../private/secret_keys.json';
import { config } from 'dotenv';
import { resolve } from 'path';
import { execSync } from 'child_process';
import fs from 'fs';
import mysql from 'mysql2/promise';
import { Client as PostgreSQLClient } from 'pg';
import { MongoClient } from 'mongodb';

const envPath = resolve(__dirname, '../.env');
config({ path: envPath });

interface DBConfig {
  port: number;
  host: string;
  user: string;
  password: string;
  database: string;
}

const HOST = process.env.DATABASE_HOST || keysBd.host;
const USER = process.env.DATABASE_USER || keysBd.user;
const PASSWORD = process.env.DATABASE_PASSWORD || keysBd.password;
const DATABASE = process.env.DATABASE_NAME || keysBd.database;
const PORT = Number(process.env.DATABASE_PORT) || keysBd.port;
const SQL_FILE = process.env.SQL_LITE || keysBd.sql_file
const MONGO_URL =process.env.MONGO_URL ||keysBd.url_mungo

const databaseConfig = {
  mysql: {
    host: HOST,
    user: USER,
    password: PASSWORD,
    port: PORT,
    database: DATABASE,  
  },
  postgresql: {
    host: HOST,
    user: USER,
    password: PASSWORD,
    port: PORT,
    database: DATABASE, 
  },
  sqlite:SQL_FILE,
  mongo:MONGO_URL , 
};

const saltRounds = 10;

class Database {
  async createAdmin() {
    const credentials = admin_credentials;

    for (const admin of credentials) {
      const salt = bcrypt.genSaltSync(saltRounds);
      const encryptedPassword = bcrypt.hashSync(admin.password, salt);

      const accessToken = jwt.sign(
        {
          id_user: 0, 
          email: admin.email,
          type: admin.type,
          access_level: 0,
        },
        secretKey.secretKey
      );

      const existingAdmin = await prisma.users.findUnique({
        where: { email: admin.email },
      });

      if (!existingAdmin) {
        await prisma.users.create({
          data: {
            email: admin.email,
            password: encryptedPassword,
            access_token: accessToken,
            type: admin.type,
            name: admin.name,
            gender: admin.gender,
            license: admin.license, // Inclua a licença
            license_expiration_date: admin.license_expiration_date, // Inclua a data de expiração da licença
          },
        });
        console.log(`Administrador ${admin.name} criado com sucesso.`);
      } else {
        await prisma.users.update({
          where: { email: admin.email },
          data: {
            access_token: accessToken,
            password: encryptedPassword,
            name: admin.name,
            type: admin.type,
            gender: admin.gender,
            license: admin.license, // Atualize a licença
            license_expiration_date: admin.license_expiration_date, // Atualize a data de expiração da licença
          },
        });
        console.log(`Administrador ${admin.name} atualizado com sucesso.`);
      }
    }
  }

  async createDatabaseIfNotExists() {
    try {
      const url = process.env.DATABASE_URL || '';

      // Identificar qual tipo de banco estamos usando
      if (url.startsWith('mysql')) {
        await this.createMySQLDatabase();
      } else if (url.startsWith('postgresql')) {
        await this.createPostgresDatabase();
      } else if (url.startsWith('sqlite')) {
        // SQLite não precisa de criação de banco de dados.
        console.log('Banco de dados SQLite não requer criação manual.');
      } else if (url.startsWith('mongodb')) {
        // MongoDB não requer criação de banco de dados manual.
        console.log('Banco de dados MongoDB não requer criação manual.');
      }
    } catch (error) {
      console.error('Erro ao verificar/criar o banco de dados:', error);
      throw error;
    }
  }

  // Criação do banco de dados MySQL, caso não exista
  private async createMySQLDatabase() {
    const connection = await mysql.createConnection({
      host: databaseConfig.mysql.host,
      user: databaseConfig.mysql.user,
      password: databaseConfig.mysql.password,
      port: databaseConfig.mysql.port,
    });

    const [databases] = await connection.query(
      `SHOW DATABASES LIKE '${databaseConfig.mysql.database}'`
    );

    if (Array.isArray(databases) && databases.length === 0) {
      console.log(`Banco de dados "${databaseConfig.mysql.database}" não existe. Criando...`);
      await connection.query(`CREATE DATABASE ${databaseConfig.mysql.database}`);
      console.log(`Banco de dados "${databaseConfig.mysql.database}" criado com sucesso.`);
      execSync('npx prisma migrate dev --name "init"');
    } else {
      console.log(`Banco de dados "${databaseConfig.mysql.database}" já existe.`);
    }

    await connection.end();
  }

  // Criação do banco de dados PostgreSQL, caso não exista
  private async createPostgresDatabase() {
    const client = new PostgreSQLClient({
      host: databaseConfig.postgresql.host,
      user: databaseConfig.postgresql.user,
      password: databaseConfig.postgresql.password,
      port: databaseConfig.postgresql.port,
    });

    await client.connect();

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${databaseConfig.postgresql.database}'`
    );

    if (res.rowCount === 0) {
      console.log(`Banco de dados "${databaseConfig.postgresql.database}" não existe. Criando...`);
      await client.query(`CREATE DATABASE ${databaseConfig.postgresql.database}`);
      console.log(`Banco de dados "${databaseConfig.postgresql.database}" criado com sucesso.`);
      execSync('npx prisma migrate dev --name "init"');
    } else {
      console.log(`Banco de dados "${databaseConfig.postgresql.database}" já existe.`);
    }

    await client.end();
  }

  // Conexão ao MongoDB (não é necessário criar o banco manualmente)
  private async connectMongoDB() {
    const client = new MongoClient(databaseConfig.mongo);
    try {
      await client.connect();
      console.log('Conectado ao MongoDB');
      execSync('npx prisma migrate dev --name "init"');
    } catch (error) {
      console.error('Erro ao conectar ao MongoDB:', error);
    } finally {
      await client.close();
    }
  }
  
  async runMigrations() {
    try {
      
      // Verifica e cria o banco de dados, se necessário
      await this.createDatabaseIfNotExists();
      
    } catch (error) {
      console.error('Erro ao executar migrações:', error);
      throw error;
    } finally {
      await prisma.$disconnect();  // Desconectar após a execução
    }
  }
  
  async initialize() {
    try {
      await this.runMigrations();
      await this.createAdmin();
    } catch (error) {
      console.error('Erro durante a inicialização do banco de dados:', error);
    } finally {
      await prisma.$disconnect();
      console.log('Conexão com o banco de dados encerrada.');
    }
  }
}

const database = new Database();

export default database;
