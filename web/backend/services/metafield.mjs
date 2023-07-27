import { FILE_KEY } from "../configs/env.mjs";
import shopify from "../configs/shopify.js";

const meta = shopify.api.rest.Metafield;

export const createOrUpdateShopifyMetafield = async ({
  session,
  value,
  key,
  namespace = FILE_KEY,
  type = "single_line_text_field",
}) => {
  try {
    const sessionData = session[0];

    const metafield = new meta({ session: sessionData });

    metafield.namespace = namespace;
    metafield.key = key;
    metafield.value = value;
    metafield.type = type;

    await metafield.save({
      update: true,
    });
  } catch (error) {
    throw new Error(error);
  }
};
