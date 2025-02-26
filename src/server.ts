import fastify, { FastifyInstance } from 'fastify';
import fastifyMultipart from '@fastify/multipart'; 
import fastifyStatic from '@fastify/static';
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { routes } from './routes/routes';
import path from 'path';
import dotenv from 'dotenv';
import servidor from '../private/server.json';
import database from './config/database';

dotenv.config();

const uploadsPath = path.join(__dirname, '../storage');

class Server {
  private readonly PORT: number;
  private readonly HOST: string;
  private readonly app: FastifyInstance;

  constructor() {
    this.PORT = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : parseInt(servidor.PORT);
    this.HOST = process.env.SERVER_HOST || servidor.HOST;
    this.app = fastify().withTypeProvider<ZodTypeProvider>();
    this.configure();
    this.registerRoutes();
    database.initialize();  // Inicialização do banco de dados aqui
  }

  private configure() {
    // Configuração do Validator e Serializer
    this.app.setValidatorCompiler(validatorCompiler);
    this.app.setSerializerCompiler(serializerCompiler);
  
    // Middleware para capturar erros de parsing de JSON
    this.app.setErrorHandler((error, req, reply) => {
      if (error.validation) {
        reply.status(400).send({ message: 'Validation error', details: error.validation });
      } else if (error instanceof SyntaxError && error.message.includes('JSON')) {
        console.error('JSON error:', error.message);
        reply.status(400).send({ message: `Invalid JSON format: ${error.message}` });
      } else {
        console.error('Unhandled error:', error);
        reply.status(500).send({ message: 'Internal Server Error' });
      }
    });
  
    // Registra o plugin de multipart
    this.app.register(fastifyMultipart);
  
    // Configuração do CORS
    this.app.register(fastifyCors, {
      origin: '*'
    });
  
    // Configuração do Swagger
    this.app.register(fastifySwagger, {
      openapi: {
        info: {
          title: 'Typed API',
          version: '1.0.0',
        },
      },
      transform: jsonSchemaTransform,
    });
  
    this.app.register(fastifySwaggerUi, {
      routePrefix: '/docs', // Certifique-se de adicionar a barra inicial
    });
  }

  private registerRoutes() {
    // Registra as rotas de arquivos estáticos
    this.app.register(fastifyStatic, {
      root: uploadsPath,
      prefix: '/uploads',
    });
    
    // Registra as rotas adicionais
    this.app.register(routes);
  }

  public async start() {
    try {
      await this.app.listen({ port: this.PORT, host: this.HOST });
      console.log(`Server is running at http://${this.HOST}:${this.PORT}`);
    } catch (err) {
      console.error('Error starting server:', err);
      process.exit(1);
    }
  }
}

// Iniciar o servidor
new Server().start();
