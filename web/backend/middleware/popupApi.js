/*
  The custom REST API to support the app frontend.
  Handlers combine application data from db.js with helpers to merge the Shopify GraphQL Admin API data.
  The Shop is the Shop that the current user belongs to. For example, the shop that is using the app.
  This information is retrieved from the Authorization header, which is decoded from the request.
  The authorization header is added by App Bridge in the frontend code.
*/

import express from "express";

import shopify from "../shopify.js";
import { PopupDB } from "../db.js";
import { getPopupOr404, getShopUrlFromSession } from "../helpers/popups.js";

const SHOP_DATA_QUERY = `
  query shopData($first: Int!) {
    shop {
      url
    }
  }
`;

export default function applyQrCodeApiEndpoints(app) {
  app.use(express.json());

  app.get("/api/shop-data", async (req, res) => {
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });

    /* Fetch shop data, including all available discounts to list in the QR code form */
    const shopData = await client.query({
      data: {
        query: SHOP_DATA_QUERY,
        variables: {
          first: 25,
        },
      },
    });

    res.send(shopData.body.data);
  });

  app.post("/api/popup", async (req, res) => {
    try {
      const response = await PopupDB.create(req);
      res.status(201).send(response);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.patch("/api/popup/:id", async (req, res) => {
    const qrcode = await getPopupOr404(req, res);

    if (qrcode) {
      try {
        await PopupDB.update(req.params.id, await parseQrCodeBody(req));
        const response = await formatQrCodeResponse(req, res, [
          await PopupDB.read(req.params.id),
        ]);
        res.status(200).send(response[0]);
      } catch (error) {
        res.status(500).send(error.message);
      }
    }
  });

  app.get("/api/popup", async (req, res) => {
    try {
      const rawCodeData = await PopupDB.list(
        await getShopUrlFromSession(req, res)
      );

      res.status(200).send(rawCodeData);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  });

  app.get("/api/popup/:id", async (req, res) => {
    const qrcode = await getPopupOr404(req, res);

    if (qrcode) {
      const formattedQrCode = await formatQrCodeResponse(req, res, [qrcode]);
      res.status(200).send(formattedQrCode[0]);
    }
  });

  app.delete("/api/popup/:id", async (req, res) => {
    const qrcode = await getPopupOr404(req, res);

    if (qrcode) {
      await PopupDB.delete(req.params.id);
      res.status(200).send();
    }
  });
}
