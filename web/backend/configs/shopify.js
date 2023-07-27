import { LATEST_API_VERSION } from "@shopify/shopify-api";
import { shopifyApp } from "@shopify/shopify-app-express";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-07";
import { MongoDBSessionStorage } from "@shopify/shopify-app-session-storage-mongodb";
import { MONGODB_NAME, MONGODB_URI } from "./env.mjs";

const shopify = shopifyApp({
  api: {
    apiKey: "8583289746d7015234fb94a19305f5ad",
    apiSecretKey: "022a8c59ae9dd43da34413c004bc69c2",
    apiVersion: LATEST_API_VERSION,
    restResources,
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  webhooks: {
    path: "/api/webhooks",
  },
  sessionStorage: new MongoDBSessionStorage(MONGODB_URI, MONGODB_NAME),
});

export default shopify;
