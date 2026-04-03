# Guia de Configuração OAuth - DUD.IA Finance

Este arquivo contém todos os passos necessários para configurar autenticação OAuth.

---

## 1. GitHub OAuth App

### Passo 1: Acesse o GitHub Developers
👉 **https://github.com/settings/developers**

### Passo 2: Crie DOIS OAuth Apps (um para DEV, outro para PROD)

#### APP 1 - Desenvolvimento Local

| Campo | Valor |
|-------|-------|
| Application name | `DUD.IA Finance Dev` |
| Homepage URL | `http://localhost:3000` |
| Authorization callback URL | `http://localhost:3000/api/auth/callback/github` |

#### APP 2 - Produção (Vercel)

| Campo | Valor |
|-------|-------|
| Application name | `DUD.IA Finance Prod` |
| Homepage URL | `https://dudiafinance.vercel.app` |
| Authorization callback URL | `https://dudiafinance.vercel.app/api/auth/callback/github` |

---

## 2. Google OAuth App

### Passo 1: Acesse o Google Cloud Console
👉 **https://console.cloud.google.com/apis/credentials**

### Passo 2: Crie um projeto (se necessário)
- Nome: `DUD.IA Finance`

### Passo 3: Configure a Tela de Consentimento OAuth
- Tipo de usuário: **Externo**
- Nome do app: `DUD.IA Finance`

### Passo 4: Configure as URLs

**Origens JavaScript autorizadas:**
```
http://localhost:3000
https://dudiafinance.vercel.app
```

**URIs de redirecionamento autorizados:**
```
http://localhost:3000/api/auth/callback/google
https://dudiafinance.vercel.app/api/auth/callback/google
```

---

## 3. Configurar Variáveis de Ambiente

### Desenvolvimento Local (.env.local)

```env
# GitHub OAuth - DEV
GITHUB_CLIENT_ID=seu_client_id_dev
GITHUB_CLIENT_SECRET=seu_client_secret_dev

# Google OAuth
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
```

### Produção (Vercel Environment Variables)

Configure no Vercel Dashboard:
- `GITHUB_CLIENT_ID` (PROD)
- `GITHUB_CLIENT_SECRET` (PROD)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_URL=https://seudominio.vercel.app`

---

## 4. IMPORTANTE: Configurar URLs de Callback no Google Console

### ⚠️ Se o OAuth redirecionar para localhost em produção, faça isso:

### Passo 1: Acesse o Google Cloud Console
👉 **https://console.cloud.google.com/apis/credentials**

### Passo 2: Clique no seu OAuth Client
- Encontre o OAuth Client que você criou (ex: "DUD.IA Finance")
- Clique no nome para editar

### Passo 3: Configurar URIs de Redirecionamento

Na seção **"URIs de redirecionamento autorizados"**, adicione TODAS estas URLs:

```
http://localhost:3000/api/auth/callback/google
https://dudiafinance.vercel.app/api/auth/callback/google
```

**Como adicionar:**
1. Clique em **"ADICIONAR URI"**
2. Cole: `https://dudiafinance.vercel.app/api/auth/callback/google`
3. Clique em **"SALVAR"** no final da página

### Passo 4: Aguarde 5 minutos
O Google levará alguns minutos para atualizar as configurações.

---

## 5. Checklist

- [ ] GitHub OAuth DEV criado
- [ ] GitHub OAuth PROD criado
- [ ] Google OAuth criado
- [ ] **URIs de callback configuradas no Google Console (localhost + produção)**
- [ ] Variáveis configuradas no `.env.local`
- [ ] Variáveis configuradas no Vercel
- [ ] NEXTAUTH_URL configurado para produção no Vercel
- [ ] Testar login local
- [ ] Testar login produção