# 🎨 Portal de Cursos - Frontend - Next.js React

Interface de usuário moderna e responsiva para o sistema de gerenciamento de treinamentos com autenticação em duas etapas (2FA) e player de vídeo integrado.

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Componentes](#-componentes)
- [Testes](#-testes)
- [Deploy](#-deploy)

## 🎯 Funcionalidades

### Autenticação
- ✅ **Login com email** e verificação em 2 etapas (2FA)
- ✅ **Código de verificação** enviado por email
- ✅ **Reenvio de código** automático
- ✅ **Proteção de rotas** com middleware
- ✅ **Renovação automática de tokens** JWT

### Dashboard do Aluno
- ✅ **Listagem de treinamentos e turmas** das quais está matriculado
- ✅ **Seleção de turma** para visualizar recursos
- ✅ **Recursos filtrados** por regras de acesso (prévio/rascunho)
- ✅ **Player de vídeo integrado** com controles completos
- ✅ **Download de recursos** (vídeos, PDFs, ZIPs)
- ✅ **Indicadores de status** (Aguardando, Em andamento, Finalizada)
- ✅ **Interface responsiva** para mobile, tablet e desktop

### Dashboard Admin
- ✅ **Gerenciamento de Treinamentos** (CRUD completo)
- ✅ **Gerenciamento de Turmas** (CRUD completo)
- ✅ **Gerenciamento de Recursos** (CRUD completo)
- ✅ **Upload de arquivos** com validação de tipo e tamanho
- ✅ **Filtros e busca** para facilitar navegação
- ✅ **Visualização e edição** de recursos
- ✅ **Player de vídeo** para preview

### Interface
- ✅ **Design moderno** com Tailwind CSS
- ✅ **Totalmente responsivo** (mobile-first)
- ✅ **Componentes reutilizáveis** bem estruturados
- ✅ **Tipagem TypeScript** completa
- ✅ **Tratamento de erros** robusto
- ✅ **Loading states** para melhor UX

## 🛠 Tecnologias

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 3.4**
- **Axios** (requisições HTTP)
- **Lucide React** (ícones)
- **Jest** (testes)
- **React Testing Library** (testes de componentes)
- **React Hook Form** (formulários)
- **Zod** (validação)

## 📦 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Git
- Backend Django rodando (padrão: http://localhost:8000)

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd sec_front
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente
```bash
# Crie um arquivo .env.local na raiz do projeto sec_front
# Veja a seção de Configuração abaixo
```

## ⚙️ Configuração

### Arquivo .env.local
Crie um arquivo `.env.local` na raiz do projeto `sec_front`:

```env
# URL da API Backend
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# URL base da aplicação (opcional)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Configurações de autenticação (opcional)
# NEXT_PUBLIC_JWT_SECRET=sua-chave-jwt-secreta
```

### Configuração da API
O front chama a API na mesma origem (`/api`) e o Next encaminha as requisições para o backend (rewrite em `next.config.ts`). O destino é definido pela variável `BACKEND_URL` (padrão `http://localhost:8000`).

**Importante:** Certifique-se de que o backend está rodando antes de iniciar o frontend.

## 🏃 Executando o Projeto

### Desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

O servidor estará disponível em: `http://localhost:3000`

**Nota:** O script `dev` está configurado para rodar em `192.168.1.12:3000`. Para usar localhost, use `npm run dev2`.

### Build de Produção
```bash
# Build
npm run build

# Executar build de produção
npm run start
```

### Linting e Formatação
```bash
# Verificar linting
npm run lint

# Corrigir problemas automaticamente (se configurado)
npm run lint:fix
```

## 📁 Estrutura do Projeto

```
sec_front/
├── src/
│   ├── app/                        # App Router (Next.js 16)
│   │   ├── admin/                  # Páginas administrativas
│   │   │   ├── page.tsx            # Dashboard admin
│   │   │   ├── treinamentos/      # Gerenciamento de treinamentos
│   │   │   │   ├── page.tsx        # CRUD de treinamentos
│   │   │   │   └── __tests__/      # Testes
│   │   │   ├── turmas/             # Gerenciamento de turmas
│   │   │   │   ├── page.tsx        # CRUD de turmas
│   │   │   │   └── __tests__/      # Testes
│   │   │   └── recursos/           # Gerenciamento de recursos
│   │   │       ├── page.tsx        # CRUD de recursos
│   │   │       ├── upload/         # Upload de arquivos
│   │   │       ├── player/         # Player de vídeo
│   │   │       └── __tests__/      # Testes
│   │   ├── aluno/                  # Páginas do aluno
│   │   │   └── dashboard/          # Dashboard do aluno
│   │   │       ├── page.tsx        # Página principal do dashboard
│   │   │       └── __tests__/      # Testes
│   │   ├── auth/                   # Autenticação
│   │   │   ├── login/               # Página de login
│   │   │   │   ├── page.tsx        # Formulário de login
│   │   │   │   └── __tests__/      # Testes
│   │   │   └── codigo/             # Verificação 2FA
│   │   │       ├── page.tsx        # Formulário de código
│   │   │       └── __tests__/      # Testes
│   │   ├── globals.css             # Estilos globais
│   │   ├── layout.tsx               # Layout principal
│   │   └── page.tsx                 # Página inicial
│   ├── components/                  # Componentes reutilizáveis
│   │   ├── Button/                 # Botão customizado
│   │   ├── Input/                  # Input customizado
│   │   ├── Card/                    # Card genérico
│   │   ├── CardAdmin/              # Card para admin
│   │   ├── DashboardLayout/        # Layout do dashboard
│   │   ├── ProtecaoRota/           # Proteção de rotas
│   │   ├── VideoPlayer/             # Player de vídeo
│   │   ├── FileUpload/              # Upload de arquivos
│   │   ├── Header/                  # Cabeçalho
│   │   ├── ModalConfirmacao/        # Modal de confirmação
│   │   ├── Toast/                   # Notificações toast
│   │   ├── ToastContainer/          # Container de toasts
│   │   └── ui/                      # Componentes de UI
│   │       └── MarketingBackground/ # Background marketing
│   ├── lib/                         # Lógica de negócio
│   │   ├── api.tsx                  # Configuração Axios
│   │   ├── auth.tsx                 # Serviços de autenticação
│   │   └── hooks/                   # Hooks personalizados
│   │       └── useApi.ts            # Hook para requisições API
│   ├── types/                       # Definições de tipos TypeScript
│   │   └── index.tsx                # Tipos principais
│   └── utils/                       # Funções utilitárias
│       ├── Const.tsx                # Constantes da aplicação
│       ├── tratamentoErros.ts       # Tratamento de erros
│       └── utils.ts                 # Utilitários diversos
├── public/                          # Arquivos estáticos
│   ├── background.jpg              # Imagem de fundo
│   ├── login_background.png         # Background do login
│   └── *.svg                       # Ícones SVG
├── __tests__/                       # Testes globais
├── .env.local                       # Variáveis de ambiente (NÃO COMMITAR)
├── .gitignore                       # Arquivos ignorados pelo Git
├── next.config.ts                   # Configurações do Next.js
├── package.json                     # Dependências e scripts
├── tailwind.config.js               # Configurações do Tailwind
├── tsconfig.json                     # Configurações do TypeScript
├── jest.config.js                    # Configurações do Jest
└── jest.setup.js                     # Setup do Jest
```

## 🧩 Componentes Principais

### Button
```typescript
<Button 
  variant="primary" | "secondary" 
  size="sm" | "md" | "lg"
  icon="arrow-right" | "download" | "exit" | ...
  carregando={false}
  desabilitado={false}
  onClick={handleClick}
>
  Clique aqui
</Button>
```

### Input
```typescript
<Input
  type="text" | "email" | "password"
  placeholder="Digite aqui"
  value={value}
  onChange={handleChange}
  erro={erro}
  className="custom-class"
/>
```

### VideoPlayer
```typescript
<VideoPlayer
  recurso={recurso}
  className="w-full h-96"
/>
```

**Funcionalidades:**
- ✅ Play/Pause
- ✅ Barra de progresso
- ✅ Controle de volume (mute/unmute)
- ✅ Fullscreen
- ✅ Reset/Restart
- ✅ Download integrado

### ProtecaoRota
```typescript
<ProtecaoRota>
  <ComponenteProtegido />
</ProtecaoRota>
```

**Funcionalidades:**
- ✅ Verifica autenticação JWT
- ✅ Redireciona para login se não autenticado
- ✅ Separa acesso admin/aluno
- ✅ Protege rotas automaticamente

### FileUpload
```typescript
<FileUpload
  onFileSelect={handleFileSelect}
  acceptedTypes={['video/*', 'application/pdf', 'application/zip']}
  maxSize={500 * 1024 * 1024} // 500MB
/>
```

## 🔧 Hooks Personalizados

### useAutenticacao
```typescript
const {
  fazerLogout,
  isAutenticado,
  isConexaoValida,
  isAdm,
  usuarioLogado,
  downloadRecursoArquivo,
  buscarTreinamentosAluno,
  // ...
} = useAutenticacao();
```

### useEstadoApi
```typescript
const {
  dados,
  carregando,
  erro,
  buscarDados,
  criarDado,
  atualizarDado,
  excluirDado
} = useEstadoApi<TipoDado>('/endpoint');
```

## 🎨 Estilos e Temas

### Tailwind CSS
O projeto usa Tailwind CSS para estilização. Classes principais:

```css
/* Cores principais */
.text-orange-base    /* Cor laranja principal */
.bg-orange-base      /* Fundo laranja */
.border-orange-base  /* Borda laranja */

/* Tipografia */
.title-md           /* Título médio */
.body-md            /* Corpo médio */
.body-sm            /* Corpo pequeno */

/* Inputs */
.input-base         /* Input padrão */

/* Botões */
.btn-primary        /* Botão primário */
.btn-secondary      /* Botão secundário */
```

### Responsividade
Breakpoints configurados:
- **Mobile**: `< 640px` (sm)
- **Tablet**: `640px - 1024px` (md, lg)
- **Desktop**: `> 1024px` (xl, 2xl)

## 🧪 Testes

### Estatísticas de Testes
- ✅ **23 test suites** passando
- ✅ **143 testes** passando
- ✅ **Tempo médio**: ~3 segundos
- ✅ **Cobertura**: Componentes principais, páginas de autenticação, dashboard

### Executar Testes
```bash
# Executar todos os testes
npm run test

# Testes em modo watch (desenvolvimento)
npm run test:watch

# Testes com cobertura
npm run test:coverage
```

### Testes Disponíveis
- ✅ **Páginas de autenticação** (login, código 2FA)
- ✅ **Dashboard do aluno** (listagem, seleção, download)
- ✅ **Dashboard admin** (CRUD de treinamentos, turmas, recursos)
- ✅ **Componentes** (Button, Input, VideoPlayer, ProtecaoRota, etc.)
- ✅ **Hooks e utilitários** (useApi, tratamentoErros, utils)

### Estrutura de Testes
```typescript
// Exemplo de teste
describe('Componente', () => {
  it('deve renderizar corretamente', () => {
    // Teste aqui
  });
  
  it('deve lidar com interações', async () => {
    // Teste de interação
  });
});
```

## 🚀 Deploy

### Deploy Local (Produção)

#### 1. Build de Produção
```bash
npm run build
```

#### 2. Executar em Produção
```bash
npm run start
```

### Demo na Vercel

Demonstração pública com dados fictícios, em plano gratuito:

- Front: https://portal-cursos-ashen.vercel.app
- Backend (Django + Postgres Neon): https://portal-cursos-api.vercel.app (veja o README do backend)

Variáveis do projeto Vercel do front:

| Variável | Uso |
|----------|-----|
| `BACKEND_URL` | Destino do rewrite de `/api` (URL do backend) |
| `NEXT_PUBLIC_DEMO` | `1` exibe a faixa "Modo demonstração" e o aviso de upload desativado (padrão desligado) |

Logins de demonstração (o código de verificação aparece na própria tela de verificação): `admin@demo.example` (administrador) e os alunos `ana.souza@`, `bruno.lima@` e `carla.menezes@demo.example`.

Limitações: o upload de arquivos fica desativado (disco efêmero e limite de cerca de 4,5 MB por requisição); os recursos de exemplo já vêm no backend. Qualquer visitante pode alterar os dados da demonstração.

### Deploy em Vercel (Recomendado)

#### 1. Instalar Vercel CLI
```bash
npm i -g vercel
```

#### 2. Deploy
```bash
# Deploy inicial
vercel

# Deploy em produção
vercel --prod
```

#### 3. Configurar Variáveis de Ambiente
No painel da Vercel, adicione:
- `BACKEND_URL`: URL do backend (ex: `https://api.seudominio.com`), sem `/api` no final

### Deploy em Netlify

#### 1. Build Command
```bash
npm run build
```

#### 2. Publish Directory
```
.next
```

#### 3. Configurar Variáveis de Ambiente
No painel da Netlify, adicione as mesmas variáveis da Vercel.

### Deploy com Docker

#### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Deploy em Servidor (Ubuntu/Debian)

#### 1. Instalar Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 2. Instalar PM2
```bash
sudo npm install -g pm2
```

#### 3. Build e Deploy
```bash
npm run build
pm2 start npm --name "portal-cursos-frontend" -- start
pm2 save
pm2 startup
```

#### 4. Configurar Nginx
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔒 Segurança

- ✅ **Proteção de rotas** com middleware `ProtecaoRota`
- ✅ **Validação de inputs** no frontend
- ✅ **Renovação automática de tokens** JWT
- ✅ **HTTPS** em produção (recomendado)
- ✅ **Sanitização** de dados
- ✅ **Tratamento seguro de erros** (sem expor dados sensíveis)

## 📱 Responsividade

O projeto é totalmente responsivo com breakpoints:
- **Mobile**: < 768px (layout em coluna única)
- **Tablet**: 768px - 1024px (layout adaptativo)
- **Desktop**: > 1024px (layout completo)

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de CORS**: Verifique se o backend está rodando e CORS configurado
2. **Página não encontrada**: Verifique se as rotas estão corretas
3. **Erro de build**: Execute `npm run lint` e corrija os problemas
4. **API não conecta**: Verifique `NEXT_PUBLIC_API_URL` no .env.local
5. **Token expirado**: O sistema renova automaticamente, mas verifique se o backend está rodando
6. **Vídeo não carrega**: Verifique se o endpoint de download está funcionando

### Logs de Debug
```bash
# Habilitar logs detalhados do Next.js
DEBUG=* npm run dev

# Verificar erros no console do navegador
# Abra DevTools (F12) e verifique a aba Console
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console do navegador
2. Consulte a documentação do Next.js: https://nextjs.org/docs
3. Consulte a documentação do React: https://react.dev
4. Abra uma issue no repositório

---

