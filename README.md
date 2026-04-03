# DUD.IA Finance

Personal finance management application with AI-powered insights.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Drizzle ORM
- Neon PostgreSQL
- NextAuth v5
- TanStack Query
- Zustand
- Recharts
- OpenRouter AI

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- PostgreSQL database (Neon)

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values.

```bash
cp .env.example .env.local
```

### Database Setup

```bash
npm run db:generate
npm run db:migrate
```

### Development

```bash
npm run dev
```

## License

MIT