# KernelEye website

The public product site for KernelEye. It is a static Next.js site, separate from the operator console in `../frontend-next`.

## Develop

```bash
npm install
npm run dev        # http://localhost:3200
```

## Build

```bash
npm run build      # static HTML in ./out
npm start          # serve ./out on :3200
```

`./out` can be hosted on any static host (GitHub Pages, Netlify, Vercel, S3, nginx).
To host under a sub-path, such as a GitHub Pages project site, set the base path when you build:

```bash
NEXT_PUBLIC_BASE_PATH=/k8s-runtime-aware-ebpf-orchestration npm run build
```

## Where things live

| Path | Contents |
|---|---|
| `src/lib/site.ts` | Product name, tagline, repo URL, navigation |
| `src/lib/features.ts` | The five feature pages: copy, example payloads, endpoints, doc links |
| `src/app/page.tsx` | Home page |
| `src/app/{architecture,get-started,docs,about}/` | Other pages |
| `src/components/HeroVisual.tsx` | Animated kernel → daemon → actions diagram |
| `src/app/globals.css` | Design tokens and all styles |
| `src/assets/` | Architecture diagrams, copied from `../images` |

The API payloads and metric names on the feature pages were checked against the daemon source (`daemon/pkg/redirection`, `daemon/pkg/scaling`, `daemon/pkg/comm`). Update `features.ts` when those structs change.
