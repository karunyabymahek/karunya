# Karunya by Mahek

**A luxury digital atelier for handcrafted art, crochet, décor, and bespoke creations.**

Karunya by Mahek is a creative studio and online storefront showcasing handmade pieces, original artwork, thoughtfully crafted home décor, floral gifts, wearables, stationery, and personalised commissions. The website is designed to present the collection and help customers submit order requests or enquire about custom work.

## Features

- **Creative storefront:** Browse published products and product details.
- **Product management:** An authenticated admin API supports creating, updating, publishing, and removing products.
- **Order requests:** Customers can submit an order request with delivery details and selected items.
- **Custom commissions:** A form/API flow captures bespoke project briefs and reference images.
- **Order and enquiry management:** Admin endpoints support reviewing requests and updating their status.
- **Studio settings:** Manage contact details and social/contact settings.
- **Image uploads:** The server can accept image data and serve uploaded files.
- **Health check:** `GET /api/health` reports the server status.

## Technology

- React 19 and TypeScript
- Vite 8
- Tailwind CSS 4
- Express
- Motion and Lucide React
- Google GenAI SDK (for AI-powered functionality where used)

## Requirements

- Node.js with npm
- A Gemini API key if you use features that call the Google GenAI API

## Run locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/karunyabymahek/karunya.git
   cd karunya
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env` (or create the environment file expected by your deployment platform) and provide the values needed by your setup. For AI-powered features, set `GEMINI_API_KEY` to your own Google Gemini API key. Do not commit real API keys or other secrets to GitHub.

   `APP_URL` is included in the example environment file for deployments that need the app's public URL.

4. **Start the development server**
   ```bash
   npm run dev
   ```

   Open the local URL printed in the terminal. The Express server defaults to port `3000`; set `PORT` if you need a different port.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Express server with Vite development middleware |
| `npm run build` | Build the frontend for production into `dist` |
| `npm run preview` | Run Vite's preview server for the built frontend |
| `npm start` | Start the server (set `NODE_ENV=production` to serve the production build) |
| `npm run lint` | Run the TypeScript check configured for the project |
| `npm run clean` | Remove generated `dist` and `server.js` outputs |

## API overview

The Express server provides these API areas:

- `GET /api/health` — health check
- `/api/auth/*` — administrator login, verification, logout, and password change
- `/api/settings` — read and update studio settings
- `/api/products` — list, create, update, and delete products
- `/api/orders` — submit and manage order requests
- `/api/enquiries` — submit and manage custom commission enquiries
- `POST /api/upload` — upload an image
- `GET /api/admin/overview` — administrator dashboard summary

Administrator routes require a valid bearer session token. See `server.ts` for route details and request fields.

## Data and deployment notes

- On startup, the server creates a local `data/db.json` file when one does not exist and creates `public/uploads` for uploaded images.
- The current data store is a local JSON file. For production, deploy to an environment with persistent storage or replace this with a managed database and durable image storage; ephemeral hosting filesystems can lose data when an instance restarts or is redeployed.
- Build the frontend with `npm run build`, then run the Express server with `NODE_ENV=production` so it serves the `dist` directory.
- Deploy the frontend and API together on a Node.js-capable host unless you have separately configured an API service. A static-only host such as GitHub Pages will not run the Express API.
- Configure environment variables and secrets in your hosting provider's settings. Never put credentials in client-side code or commit them to the repository.
- Before making the storefront public, review administrator authentication, payment/order handling, privacy, backups, and production security settings.

## Project structure

```text
.
├── public/             # Static assets and uploaded images
├── src/                # Frontend application source and assets
├── data/               # Runtime JSON data (created by the server)
├── server.ts           # Express API and frontend server
├── index.html          # HTML entry point and page metadata
├── vite.config.ts      # Vite, React, and Tailwind configuration
├── tsconfig.json       # TypeScript configuration
├── package.json        # Dependencies and npm scripts
└── .env.example        # Environment variable template
```

## Brand

Karunya by Mahek celebrates considered craftsmanship, expressive materials, and meaningful handmade objects. The visual identity uses warm cream, burgundy, and editorial typography to create a soft, timeless atelier feel.

---

Made with care by **Karunya by Mahek**.
