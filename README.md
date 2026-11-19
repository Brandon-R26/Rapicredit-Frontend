# Rapicredit — Loan Management Portal

Web front end for the back office of a loan company. Staff use it to register clients, review loan requests, manage active loans and payments, assign collectors and configure interest rates.

Built as a team project for a university course at UNITEC (December 2025).

## Features

| Module | Route | What it does |
|---|---|---|
| Login | `/login` | Staff sign-in |
| Dashboard | `/dashboard` | Overview of the operation |
| Clients | `/clientes` | Create, edit and deactivate clients |
| Loan requests | `/solicitudes` | Review and process incoming requests |
| Loans | `/prestamos` | Active loans |
| Payments | `/pagos` | Payment records |
| Collectors | `/cobradores` | Field collectors |
| Employees | `/empleados` | Staff management |
| Interest rates | `/tasas` | Rate configuration |
| Reports | `/reportes` | Reports |
| Settings | `/configuracion` | App settings |

## Tech stack

- **Next.js 16** (App Router) with **React 19** and the React Compiler
- **TypeScript**
- **Material UI 7** (with Emotion) for components and theming
- A small typed `fetch` wrapper (`src/lib/api.ts`) that talks to a separate REST back end, with bearer-token support and centralized error handling

## Project structure

```
src/
├── app/          # One folder per route (App Router)
├── components/   # Shared UI components
├── hooks/        # Custom React hooks
├── lib/api.ts    # API client for the back end
└── theme/        # Material UI theme
```

## Running it locally

Requires Node.js 20+ and the Rapicredit back end running somewhere reachable.

```bash
npm install
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8080" > .env.local   # your back-end URL
npm run dev
```

Then open http://localhost:3000.

## Team

| Member | Main contributions |
|---|---|
| [Brandon Hernández](https://github.com/Brandon-R26) | Project setup, base layout and visual template, API client and back-end integration, code reviews and merges |
| [@jesusr0604](https://github.com/jesusr0604) | Employees and interest-rate modules |
| [@KDBlitzz](https://github.com/KDBlitzz) | Loan-request module, client edit and deactivate actions, fixes |
| [@andrea-castillosz](https://github.com/andrea-castillosz) | Login and clients module |

---

<details>
<summary><b>En español</b></summary>

Front end del sistema administrativo de una financiera. El personal lo usa para registrar clientes, revisar solicitudes de préstamo, administrar préstamos y pagos, asignar cobradores y configurar tasas de interés.

Proyecto en equipo para un curso de UNITEC (diciembre de 2025), hecho con Next.js 16, React 19, TypeScript y Material UI 7. Se conecta a un back end REST aparte mediante `src/lib/api.ts`.

**Mi parte:** la configuración inicial del proyecto, la plantilla visual y el layout base, el cliente de la API con la integración al back end, y la revisión y el merge de ramas del equipo.

Para correrlo: `npm install`, definir `NEXT_PUBLIC_API_BASE_URL` en `.env.local` con la URL del back end, y `npm run dev`.

</details>
