import * as fs from 'fs';
import * as path from 'path';
import { FastifyReply, type FastifyRequest } from 'fastify';
import { resolve } from 'path';
import { config } from 'dotenv';
import { prisma } from '../config/prisma_client';

const uploadsPath = path.resolve(__dirname, '../../storage');
const envPath = resolve(__dirname, '../.env');
config({ path: envPath });

export default class FileService {
  private STORAGE_BASE_URL: string | undefined;
  private STORAGE_BASE_PROTOCOL: string | undefined;
  private basePath: string;

  constructor() {
    this.basePath = process.cwd();
    this.STORAGE_BASE_URL = process.env.STORAGE_BASE_URL;
    this.STORAGE_BASE_PROTOCOL = process.env.STORAGE_BASE_PROTOCOL;
  }

  public saveFile(fileBuffer: Buffer, fileName: string, directory: string): string {
    try {
      // Cria o caminho completo do diretório
      const directoryPath = path.join(uploadsPath, directory);

      // Verifica se o diretório existe e o cria se necessário
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
      }

      // Combina o diretório com o nome do arquivo para obter o caminho completo
      const filePath = path.join(directoryPath, fileName);

      // Salva o arquivo no caminho especificado
      fs.writeFileSync(filePath, fileBuffer);

      console.log(`Arquivo salvo em: ${filePath}`);
      return filePath;
    } catch (error) {
      this.handleError(error, 'Erro ao salvar o arquivo');
    }
  }

  public async getPath(id_user: string): Promise<string | null> {
    try {
      console.log(id_user)
      const user = await prisma.user.findUnique({
        where: { id_user },
      });
      console.log(user)
      if(user){
        return user.path
      }
      return  null;
    } catch (error) {
      console.error('Erro ao buscar o caminho do usuário:', error);
      return null;
    }
  }

  public createUploadFolder(folderName: string): string {
    try {
      const newFolderPath = path.join(uploadsPath, folderName);

      // Cria a pasta, incluindo os diretórios pai, se necessário
      fs.mkdirSync(newFolderPath, { recursive: true });

      console.log(`Pasta criada em: ${newFolderPath}`);
      return newFolderPath;
    } catch (error) {
      this.handleError(error, 'Erro ao criar a pasta');
    }
  }

  public generateLink(directory: string, req: FastifyRequest, fileName: string): string {

  
    const host = this.STORAGE_BASE_URL || req.host;
    const protocol = this.STORAGE_BASE_PROTOCOL || req.protocol;
    
    return `${protocol}://${host}/uploads/${directory}/${fileName}`;
  }

  public deleteFile(filePath: string): void {
    try {
      const fullPath = path.join(uploadsPath, filePath);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`Arquivo deletado: ${fullPath}`);
      } else {
        console.warn(`Arquivo não encontrado: ${fullPath}`);
      }
    } catch (error) {
      this.handleError(error, 'Erro ao deletar o arquivo');
    }
  }

  private handleError(error: unknown, message: string): never {
    if (error instanceof Error) {
      console.error(`${message}: ${error.message}`);
      throw new Error(message);
    } else {
      console.error(`${message}: Erro desconhecido.`);
      throw new Error(message);
    }
  }
}
