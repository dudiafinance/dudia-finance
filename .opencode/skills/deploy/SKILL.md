# Skill: Deploy

## Objetivo
Esta skill ensina o agente a preparar o código para deploy e fazer deploy no Vercel.

## Quando Usar
Use esta skill antes de commitar e fazer deploy do código.

## Checklist de Pré-Deploy

### 1. Código Limpo
```bash
# Typecheck
npm run typecheck

# Lint
npm run lint

# Format
npm run format:check

# Build
npm run build
```

### 2. Variáveis de Ambiente
Certifique-se de que todas as variáveis estão configuradas:
- [ ] DATABASE_URL
- [ ] DIRECT_DATABASE_URL
- [ ] NEXTAUTH_SECRET
- [ ] NEXTAUTH_URL
- [ ] OPENROUTER_API_KEY
- [ ] RESEND_API_KEY
- [ ] CRON_SECRET

### 3. Secrets no GitHub
```bash
# Verificar secrets
gh secret list --repo dudiafinance/dudia-finance

# Deve conter:
- VERCEL_TOKEN
- VERCEL_ORG_ID
- VERCEL_PROJECT_ID
- DATABASE_URL
- NEXTAUTH_SECRET
- CRON_SECRET
- OPENROUTER_API_KEY
- RESEND_API_KEY
```

### 4. Variáveis no Vercel
Verificar em: vercel.com → Projeto → Settings → Environment Variables

### 5. Migrações de Banco
```bash
# Gerar migration (se houver mudanças)
npm run db:generate

# Aplicar migration
npm run db:migrate
```

## Processo de Deploy

### Desenvolvimento (Branch develop)
```bash
# 1. Checkout
git checkout develop

# 2. Pull latest
git pull origin develop

# 3. Typecheck
npm run typecheck

# 4. Lint
npm run lint

# 5. Build
npm run build

# 6. Test
npm run test (se houver)

# 7. Commit
git add .
git commit -m "feat: descrição da feature"

# 8. Push
git push origin develop
```

### Pull Request (develop → main)
```bash
# 1. Criar PR
gh pr create --base main --head develop --title "Título" --body "Descrição"

# 2. Aguardar CI passar
# GitHub Actions executa: typecheck, lint, build

# 3. Verificar preview URL
# Vercel cria URL de preview automaticamente

# 4. Aprovar e fazer merge
gh pr merge [PR_NUMBER] --squash
```

### Produção (Branch main)
```bash
# 1. Pull latest
git checkout main
git pull origin main

# 2. Verificar se CI passou
# GitHub Actions executa: migrations + deploy

# 3. Verificar deploy
# Acessar: https://dudia-finance.vercel.app
```

## Rollback

### Via Vercel Dashboard
1. Acessar vercel.com
2. Selecionar projeto
3. Ir em "Deployments"
4. Clicar nos "..." do deploy anterior
5. "Rollback to this deployment"

### Via CLI
```bash
# Listar deploys
vercel list

# Rollback para deploy específico
vercel rollback [DEPLOYMENT_URL]
```

## Monitoramento

### Verificar Logs
```bash
# CLI do Vercel
vercel logs

# Ou via dashboard
# vercel.com → Projeto → Logs
```

### Verificar Cron Jobs
```bash
# Vercel Dashboard → Settings → Cron Jobs
# Verificar se estão ativos:
- POST /api/webhooks/cron (diário 2h UTC)
- POST /api/webhooks/cron (domingo 8h UTC)
```

## Troubleshooting

### Build Falha
```bash
# Verificar erros localmente
npm run build

# Verificar variáveis de ambiente
vercel env pull .env.local

# Testar build local
vercel build
```

### Migration Falha
```bash
# Verificar connection string
echo $DIRECT_DATABASE_URL

# Testar conexão
npx drizzle-kit studio

# Reverter migration
npx drizzle-kit rollback
```

### Runtime Error
```bash
# Verificar logs
vercel logs --output raw

# Verificar variáveis
vercel env ls
```

## Comandos Úteis

### Ver CLI
```bash
# Login
vercel login

# Listar projetos
vercel list

# Deploy manual
vercel --prod

# Ver variáveis
vercel env ls

# Pull de variáveis
vercel env pull .env.local
```

### GitHub CLI
```bash
# Ver status do PR
gh pr status

# Ver checks do PR
gh pr checks

# Ver deploy URL
gh pr view [PR_NUMBER] --web
```

## Checklist Final
- [ ] Typecheck passou
- [ ] Lint passou
- [ ] Build passou
- [ ] Testes passaram (se houver)
- [ ] Variáveis de ambiente configuradas
- [ ] Secrets no GitHub configurados
- [ ] Variáveis no Vercel configuradas
- [ ] Migrações aplicadas
- [ ] Deploy realizado
- [ ] URL acessível
- [ ] Logs sem erros

## URLs Importantes
- GitHub: https://github.com/dudiafinance/dudia-finance
- Vercel: https://vercel.com/dudiafinance/dudia-finance
- Produção: https://dudia-finance.vercel.app