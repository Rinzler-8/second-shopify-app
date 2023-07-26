import { createOrUpdateShopifyMetafield } from "../services/metafield.mjs";
import { PopupDB, ShopInfoDB } from "../db.js";
import shopify from "../shopify.js";
import { FILE_KEY } from "../configs/env.mjs";

const initMetafield = async ({ session, shopDomain }) => {
  const shopData = await PopupDB.readDomain(shopDomain);

  const promises = [];

  promises.push(async () => {
    let themeSettings = shopData;
    await createOrUpdateShopifyMetafield({
      key: "popup",
      session,
      value: JSON.stringify(themeSettings),
      namespace: FILE_KEY,
      type: "json",
    });
  });
  console.log("promises ", promises);

  return promises;
};

export const checkShopInstalled = async (req, res, next) => {
  try {
    const shop = req.query.shop;
    const session = await shopify.config.sessionStorage.findSessionsByShop(
      shop
    );

    if (!session[0]) {
      throw new Error("Shop session not found.");
    }

    const shopConfig = await shopify.api.rest.Shop.all({
      session: session[0],
    });

    const { name, email: owner, country, phone } = shopConfig.data[0];

    const popupInfo = {
      shopDomain: `https://${shop}`,
      title: "Don't want to miss anything?",
      description:
        "Be the first to see new arrivals, exclusive deals and much more.",
      button: "Subscribe",
      button_url: "",
      popup_bg: "#ffffff",
      text_color: "#000",
      button_color: "#000",
      image:
        "https://cdn.shopify.com/s/files/1/0572/5958/9809/files/popup-image.jpg",
      template: "template-1",
    };

    const shopInfo = {
      shopDomain: shop,
      name,
      owner,
      country,
      phone,
      deleted: false,
    };

    const shopExists = await ShopInfoDB.readDomain(shop);
    // or could use count
    if (!shopExists) {
      await ShopInfoDB.create(shopInfo);
      await PopupDB.create(popupInfo);
    } else {
      await ShopInfoDB.update(shop, shopInfo);
      await PopupDB.updateDomain(shop, popupInfo);
    }

    await initMetafield({ session, shopDomain: `https://${shop}` });
    await next();
  } catch (error) {
    next(error);
  }
};
