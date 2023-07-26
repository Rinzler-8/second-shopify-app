import { DeliveryMethod } from "@shopify/shopify-api";
import { ShopInfoDB } from "./db.js";
/**
 * @type {{[key: string]: import("@shopify/shopify-api").WebhookHandler}}
 */

export default {
  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
    },
  },

  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
    },
  },

  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
    },
  },
  APP_UNINSTALLED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      const shopInfo = {
        name: payload.name,
        owner: payload.email,
        country: payload.country,
        phone: payload.phone,
        deleted: true,
      };
      await ShopInfoDB.update(payload.domain, shopInfo);
    },
  },
};
