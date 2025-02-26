# My Backend Structure

Este é um projeto backend estruturado utilizando **Fastify** e **TypeScript**. A organização das pastas segue boas práticas para facilitar a manutenção e escalabilidade.

## 📁 Estrutura de Pastas

```
my_backend_structure/
│── node_modules/      # Dependências do projeto (gerenciado pelo pnpm)
│── prisma/            # Configuração do Prisma ORM
│   ├── migrations/    # Arquivos de migração do banco de dados
│   ├── schema.prisma  # Definição do esquema do banco de dados
│── private/           # Arquivos privados (exemplo: chaves de configuração)
│── src/               # Código-fonte principal
│   ├── config/        # Configuração da aplicação (banco de dados, variáveis de ambiente, etc.)
│   ├── controllers/   # Lógica dos controladores (handlers das requisições)
│   ├── routes/        # Definição das rotas da API
│   ├── schemas/       # Definição de esquemas e validações
│   ├── services/      # Regras de negócios e funções reutilizáveis
│   ├── types/         # Definição de tipos TypeScript
│   ├── utils/         # Funções utilitárias auxiliares
│   ├── server.ts      # Arquivo principal do servidor Fastify
│── .env               # Variáveis de ambiente
│── .gitignore         # Arquivos ignorados pelo Git
│── package.json       # Configuração do projeto e dependências
│── pnpm-lock.yaml     # Versões bloqueadas das dependências
│── tsconfig.json      # Configuração do TypeScript
```

## 🚀 Tecnologias Utilizadas

- **Fastify** - Framework web rápido e eficiente para Node.js
- **TypeScript** - Tipagem estática para JavaScript
- **Prisma** - ORM moderno para gerenciamento do banco de dados
- **Dotenv** - Gerenciamento de variáveis de ambiente
- **PNPM** - Gerenciador de pacotes eficiente

## 🔧 Como Executar

1. Instale as dependências:
   ```sh
   pnpm install
   ```

2. Configure as variáveis de ambiente no arquivo `.env`.

3. Execute a aplicação:
   ```sh
   pnpm run dev
   ```

## 📌 Contribuições

Sinta-se à vontade para contribuir com melhorias para este projeto. Sugestões e PRs são bem-vindos!

---

📌 **Autor:** Orlando Martinho 


