# Nexo Studio — Demo Strapi + TanStack Start

Landing page de demonstração para mostrar ao cliente como funciona a gestão de conteúdo com o **Strapi**.

```
backend/   → Strapi 5 (CMS)          → deploy no Railway
frontend/  → TanStack Start + React  → deploy na Vercel
```

## Páginas

| Rota               | Conteúdo                                                                 |
| ------------------ | ------------------------------------------------------------------------ |
| `/`                | Landing page. Hero e seção de serviços vêm do Strapi + últimas notícias  |
| `/noticias`        | Lista de notícias (Strapi), com destaque e filtro por categoria          |
| `/noticias/:slug`  | Matéria completa (rich text do Strapi)                                   |
| `/contato`         | Formulário visual (não envia nada — apenas demonstração)                 |

As áreas que vêm do CMS têm um selo **“Conteúdo via Strapi”** para o cliente identificar.

## Modelos de conteúdo no Strapi

- **Página Inicial** (single type): etiqueta, título, subtítulo, imagem e botão do hero; título/subtítulo da seção de serviços.
- **Serviço** (coleção): título, descrição, ícone (lista), imagem opcional, ordem.
- **Notícia** (coleção): título, slug, resumo, capa, categoria, autor, conteúdo (rich text).

Na primeira inicialização o Strapi **libera a leitura pública** dessas APIs e **cria conteúdo de exemplo**
(com imagens) automaticamente — ver `backend/src/seed.ts`. O seed roda uma única vez por banco.

## Rodando localmente

```bash
# 1) Strapi
cd backend
npm install
npm run develop        # http://localhost:1337/admin → crie o usuário admin

# 2) Front
cd frontend
npm install
cp .env.example .env   # VITE_STRAPI_URL=http://localhost:1337
npm run dev            # http://localhost:3000
```

## Deploy

### Strapi no Railway

1. Novo projeto → **Deploy from GitHub repo** → em *Settings › Root Directory* use `backend`.
2. Adicione um banco **PostgreSQL** ao projeto (SQLite seria apagado a cada deploy).
3. Variáveis do serviço Strapi:

   ```
   NODE_ENV=production
   DATABASE_CLIENT=postgres
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   APP_KEYS=chave1,chave2,chave3,chave4
   API_TOKEN_SALT=...
   ADMIN_JWT_SECRET=...
   TRANSFER_TOKEN_SALT=...
   JWT_SECRET=...
   ENCRYPTION_KEY=...
   PUBLIC_URL=https://SEU-SERVICO.up.railway.app
   IS_PROXIED=true
   ```

   Gere cada segredo com `openssl rand -base64 16` (ou `node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"`).

4. Build: `npm run build` · Start: `npm run start` (detectados automaticamente).
5. **Uploads:** as imagens ficam em `public/uploads`. Crie um **Volume** no Railway montado em
   `/app/public/uploads` para elas não sumirem a cada deploy.
6. Gere o domínio público em *Settings › Networking*, acesse `/admin` e crie o usuário administrador.

### Front na Vercel

1. *Add New Project* → importe o repositório → **Root Directory:** `frontend` (framework TanStack Start é detectado).
2. Variável de ambiente: `VITE_STRAPI_URL=https://SEU-SERVICO.up.railway.app` (sem barra no final).
3. Deploy. Se trocar a URL do Strapi depois, faça **Redeploy** (variáveis `VITE_` entram no build).

## Roteiro para o cliente testar

1. Abrir o site e observar os selos “Conteúdo via Strapi”.
2. Entrar no painel (`/admin`) → *Content Manager* → **Página Inicial** → mudar o título → **Publish**.
3. Atualizar o site: o novo título aparece no topo.
4. Criar uma **Notícia** com capa e texto → **Publish** → ela aparece em `/noticias` e na home.
5. Em **Serviço**, mudar a ordem ou o ícone de um card → **Publish**.

> Dica: o painel pode ficar em português em *Perfil (canto inferior esquerdo) › Interface language › Português (Brasil)*.
