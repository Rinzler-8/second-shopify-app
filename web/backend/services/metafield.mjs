import { FILE_KEY } from "../configs/env.mjs";
import shopify from "../shopify.js";

const meta = shopify.api.rest.Metafield;

export const createOrUpdateShopifyMetafield = async ({
  session,
  id,
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
    console.log("metafield ", metafield);

  } catch (error) {
    throw new Error(error);
  }
};

// export const deleteShopifyMetafield = async ({
//   session,
//   namespace = FILE_KEY,
//   key,
// }) => {
//   try {
//     const metafield = await meta.Metafield.all({
//       namespace,
//       key,
//       session,
//     });

//     if (metafield?.[0]) {
//       await meta.Metafield.delete({
//         id: metafield?.[0]?.id,
//         session,
//       });
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// };
