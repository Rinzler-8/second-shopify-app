import { FILE_KEY } from "../configs/env.mjs";
import shopify from "../shopify.js";

export const createOrUpdateShopifyMetafield = async ({
  session,
  id,
  value,
  key,
  namespace = FILE_KEY,
  type = "single_line_text_field",
}) => {
  try {
    const meta = shopify.api.rest;
    const metafield = new meta.Metafield({ session });

    if (id) metafield.id = id;

    metafield.namespace = namespace;
    metafield.key = key;
    metafield.value = value;
    metafield.type = type;
    const result = await metafield.save({
      update: true,
    });
    console.log("result ", result);

    return result;
  } catch (error) {
    throw new error(error);
  }
};

export const deleteShopifyMetafield = async ({
  session,
  namespace = FILE_KEY,
  key,
}) => {
  try {
    const metafield = await meta.Metafield.all({
      namespace,
      key,
      session,
    });

    if (metafield?.[0]) {
      await meta.Metafield.delete({
        id: metafield?.[0]?.id,
        session,
      });
    }
  } catch (error) {
    throw new error(error);
  }
};
