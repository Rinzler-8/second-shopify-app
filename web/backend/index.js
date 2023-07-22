// @ts-check
import { join, dirname } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import applyQrCodeApiEndpoints from "./middleware/popupApi.js";
import GDPRWebhookHandlers from "./gdpr.js";
import { checkShopInstalled } from "./helpers/checkShopInstalled.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const frontendPath = dirname(process.cwd()); // This will go one directory level up to remove the 'backend' part
const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? join(frontendPath, "/frontend/dist")
    : join(frontendPath, "/frontend/");

const app = express();

// Set up Shopify authentication and webhook handling
app.get(
  shopify.config.auth.path,
  (req, res, next) => {
    console.log("begin auth");
    next();
  },
  shopify.auth.begin()
);
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  (req, res, next) => {
    console.log("begin callback");
    next();
  },
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  (req, res, next) => {
    console.log("process webhooks");
    next();
  },
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

applyQrCodeApiEndpoints(app);

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use(
  "/*",
  shopify.ensureInstalledOnShop(),
  checkShopInstalled,
  async (_req, res, _next) => {
    return res
      .status(200)
      .set("Content-Type", "text/html")
      .send(readFileSync(join(STATIC_PATH, "index.html")));
  }
);

app.listen(PORT);
