# Hillary Cohort Builder (Front-end Skeleton)

UI mock/offline para descoberta de coortes clínicas via chat, com painel lateral de resumo estilo feasibility/cohort discovery.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Persistência local em `localStorage`

## Onde plugar backend
- Stub principal: `lib/mock.ts`
- Função de integração:

```ts
async function runCohortQuery(userText: string, context: ChatContext): Promise<CohortResult>
```

Substitua o mock por chamada API real (REST/GraphQL/SSE), mantendo o contrato de retorno.

## Contratos esperados
Veja `lib/types.ts` para:
- `Message`
- `ChatContext`
- `CohortCriterion`
- `CohortSummary`
- `CohortFunnelStep`
- `CohortResultRow`
- `CohortResult`
- `SavedCohort`

## Notas
- Sem IA real e sem DB (somente mocks determinísticos).
- Export disponível em CSV/JSON (`lib/export.ts`).
- TODOs de autenticação, streaming real e permissões por projeto estão no stub.

## Deploy no Vercel (evitar NOT_FOUND)
- Garanta que o **Root Directory** do projeto no Vercel esteja apontando para esta pasta (`/workspace/Healthtech` no repositório).
- Use configuração padrão de Next.js (`Framework Preset: Next.js`).
- Este projeto usa `app/page.tsx` como rota raiz (`/`), então um build/deploy bem-sucedido deve servir a home diretamente.
- Para compatibilidade máxima com Vercel, a configuração foi ajustada para `next.config.mjs`.


## Erro de deploy Vercel: `No Output Directory named "public" found`
Se o Vercel estiver configurado com **Output Directory = public**, o deploy de Next.js falha com essa mensagem.

Este projeto gera saída em `.next` (SSR/App Router), não em `public`.

Checklist de correção no Vercel:
1. `Framework Preset` = **Next.js**
2. `Build Command` = `next build`
3. `Output Directory` = **vazio (recomendado)** ou `.next`
4. `Root Directory` apontando para a pasta correta do projeto

Também foi adicionado `vercel.json` com configuração explícita para evitar esse erro.
