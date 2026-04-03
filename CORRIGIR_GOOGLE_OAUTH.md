# Corrigir Google OAuth em Produção

## Problema

Ao tentar fazer login com Google na produção (`https://dudiafinance.vercel.app`), você é redirecionado para `localhost:3000`.

## Causa

O Google OAuth está configurado apenas para localhost, sem a URL de produção.

## Solução

### Passo 1: Acesse o Google Cloud Console

👉 **https://console.cloud.google.com/apis/credentials**

### Passo 2: Selecione seu projeto

- Clique no projeto "DUD.IA Finance" (ou o nome que você criou)

### Passo 3: Edite o OAuth Client

1. Na lista de credenciais, encontre **"ID do cliente OAuth"** → clique nele
2. Encontre a seção **"URIs de redirecionamento autorizados"**

### Passo 4: Adicione a URL de produção

Atualmente deve estar assim:
```
http://localhost:3000/api/auth/callback/google
```

**Adicione mais uma:**
```
https://dudiafinance.vercel.app/api/auth/callback/google
```

**Deve ficar assim:**
```
http://localhost:3000/api/auth/callback/google
https://dudiafinance.vercel.app/api/auth/callback/google
```

### Passo 5: Salve

1. Role até o final da página
2. Clique em **"SALVAR"**

### Passo 6: Aguarde

- O Google leva **alguns minutos** para atualizar
- Aguarde **5 minutos** antes de testar novamente

### Passo 7: Teste

1. Acesse: **https://dudiafinance.vercel.app/login**
2. Clique em **"Entrar com Google"** ou **"Criar conta com Google"**
3. Deve redirecionar para o Google
4. Após permitir, deve voltar para a página inicial logado

---

## Mesmo processo para GitHub OAuth

Se o GitHub OAuth também não funcionar em produção, adicione:

**No GitHub OAuth Apps (DEV):**
- Authorization callback URL: já deve ter `http://localhost:3000/api/auth/callback/github`

**No GitHub OAuth Apps (PROD):**
- Authorization callback URL: `https://dudiafinance.vercel.app/api/auth/callback/github`

---

## URLs de Callback Necessárias

| Provedor | URL de Callback |
|----------|----------------|
| Google (DEV) | `http://localhost:3000/api/auth/callback/google` |
| Google (PROD) | `https://dudiafinance.vercel.app/api/auth/callback/google` |
| GitHub (DEV) | `http://localhost:3000/api/auth/callback/github` |
| GitHub (PROD) | `https://dudiafinance.vercel.app/api/auth/callback/github` |

---

## Verificação no Vercel

Certifique-se de que no Vercel estejam configuradas:

### Environment Variables (Production)

| Variável | Valor |
|----------|-------|
| `NEXTAUTH_URL` | `https://dudiafinance.vercel.app` |
| `GOOGLE_CLIENT_ID` | (seu Client ID) |
| `GOOGLE_CLIENT_SECRET` | (seu Client Secret) |
| `GITHUB_CLIENT_ID` | (seu Client ID PROD) |
| `GITHUB_CLIENT_SECRET` | (seu Client Secret PROD) |

---

## Ainda não funciona?

1. Limpe o cache do navegador
2. Tente em uma janela anônima
3. Verifique se o <strong>domínio no Vercel</strong> está correto: `dudiafinance.vercel.app`
4. Verifique se o <strong>domínio no Google Console</strong> está correto: `dudiafinance.vercel.app`