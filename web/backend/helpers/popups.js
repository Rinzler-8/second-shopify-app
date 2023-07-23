import shopify from "../shopify.js";
import { PopupDB } from "../db.js";

/*
  The app's database stores the description and the popup_bg.
  This query is used to get the fields the frontend needs for those IDs.
  By querying the Shopify GraphQL Admin API at runtime, data can't become stale.
  This data is also queried so that the full state can be saved to the database, in order to generate QR code links.
*/

export async function getPopupOr404(req, res, checkDomain = true) {
  try {
    const response = await PopupDB.read(req.params.id);
    if (
      response === undefined ||
      (checkDomain &&
        (await getShopUrlFromSession(req, res)) !== response.shopDomain)
    ) {
      res.status(404).send();
    } else {
    return response;
    }
  } catch (error) {
    res.status(500).send(error.message);
  }

  return undefined;
}

export async function parsePopupBody(req, res) {
  return {
    title: req.body.title,
    description: req.body.description,
    button: req.body.button,
    button_url: req.body.button_url,
    popup_bg: req.body.popup_bg,
    text_color: req.body.text_color,
    button_color: req.body.button_color,
    image: req.body.image,
    deleted: req.body.deleted,
  };
}

export async function getShopUrlFromSession(req, res) {
  return `https://${res.locals.shopify.session.shop}`;
}
