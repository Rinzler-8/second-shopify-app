// @ts-check
import { join, dirname } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./configs/shopify.js";
import applyPopupApiEndpoints from "./middleware/popupApi.js";
import GDPRWebhookHandlers from "./configs/gdpr.js";
import { checkShopInstalled } from "./helpers/checkShopInstalled.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const frontendPath = dirname(process.cwd());
const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? join(frontendPath, "/frontend/dist")
    : join(frontendPath, "/frontend/");

const app = express();

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
  },
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

applyPopupApiEndpoints(app);

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
