# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deploy automatico a Cloudflare Pages

Este repo incluye el workflow `.github/workflows/pages-deploy.yml` para construir y publicar `dist` con GitHub Actions.

- Rama `main`: despliegue al proyecto `main-turicine`.
- Rama `stage`: despliegue al proyecto `stage-turicine`.

### Secretos requeridos en GitHub

Configura estos secretos en el repositorio:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Proyectos de Pages usados por el workflow:

- `main-turicine` (produccion)
- `stage-turicine` (pruebas)

### Flujo recomendado

1. Trabajar y validar en `stage`.
2. Hacer push a `stage` para publicar pruebas.
3. Cuando esté validado, merge a `main` para publicar producción.
