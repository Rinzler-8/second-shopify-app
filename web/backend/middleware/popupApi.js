import express from "express";

import shopify from "../configs/shopify.js";
import { PopupDB } from "../db.js";
import { getPopupOr404, getShopUrlFromSession } from "../helpers/popups.js";
import { FILE_KEY } from "../configs/env.mjs";
import { createOrUpdateShopifyMetafield } from "../services/metafield.mjs";

export default function applyPopupApiEndpoints(app) {
  app.use(express.json());

  app.post("/api/shopify/generate-uploads", async (req, res) => {
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });
    const shopData = await client.query({
      data: {
        query: `mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
          stagedUploadsCreate(input: $input) {
            stagedTargets {
              url
              resourceUrl
              parameters {
                name
                value
              }
            }
          }
        }`,
        variables: {
          input: [
            {
              filename: req.body.filename,
              mimeType: req.body.mimeType,
              httpMethod: "POST",
              resource: "IMAGE",
            },
          ],
        },
      },
    });

    const responseJson =
      shopData.body.data.stagedUploadsCreate.stagedTargets[0];

    res.json(responseJson);
  });

  app.post("/api/shopify/create-file", async (req, res) => {
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });

    const shopData = await client.query({
      data: {
        query: `
        mutation fileCreate($files: [FileCreateInput!]!) {
          fileCreate(files: $files) {
            files {
              ... on MediaImage {
                alt
                createdAt
                id
                preview {
                  image {
                    originalSrc
                  }
                }
                status
              }
              ... on GenericFile {
                id
                alt
                createdAt
                fileStatus
                mimeType
                url
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
        variables: {
          files: {
            alt: req.body.alt,
            contentType: req.body.contentType,
            originalSource: req.body.resourceUrl,
          },
        },
      },
    });

    res.send(shopData.body.data.fileCreate.files[0]);
  });

  app.post("/api/shopify/get-file", async (req, res) => {
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });

    let result = await client.query({
      data: {
        query: `
        query getImageById($id: ID!) {
          node(id: $id) {
            ... on MediaImage {
              alt
              createdAt
              status
              image {
                originalSrc
                width
                height
              }
              id
            }
          }
        }
      `,
        variables: {
          id: req.body.id,
        },
      },
    });

    const promise = new Promise((resolve) => {
      const interval = setInterval(async () => {
        if (result?.body?.data?.node?.status === "FAILED") resolve(undefined);
        else if (
          result?.body?.data?.node?.status === "READY" ||
          result?.body?.data?.node?.fileStatus === "READY"
        ) {
          clearInterval(interval);
          resolve(result?.body?.data?.node);
        }
      }, 250 * 4);
    });
    promise
      .then((imageUrl) => {
        res.send(imageUrl);
      })
      .catch((error) => {
        console.error("Error:", error);
        res.status(500).send("An error occurred");
      });
  });

  app.post("/api/shopify/update-file", async (req, res) => {
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });

    const shopData = await client.query({
      data: {
        query: `
         mutation fileUpdate($input: [FileUpdateInput!]!) {
          fileUpdate(files: $input) {
            files {
              alt
              ... on MediaImage {
                id
                preview {
                  image {
                    originalSrc
                  }
                }
                status
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
        variables: {
          files: {
            id: req.body.imageId,
            alt: req.body.altText,
          },
        },
      },
    });

    res.send(shopData.body.data.fileCreate.files[0]);
  });

  app.post("/api/popup", async (req, res) => {
    const newData = {
      title: req.body.title,
      description: req.body.description,
      button: req.body.button,
      button_url: req.body.button_url,
      popup_bg: req.body.popup_bg,
      text_color: req.body.text_color,
      button_color: req.body.button_color,
      image: req.body.image,
      template: req.body.template,
    };
    try {
      const response = await PopupDB.create(newData);
      res.status(201).send(response);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.patch("/api/popup/:id", async (req, res) => {
    const popup = await getPopupOr404(req, res);
    const urlObject = new URL(req.body.shopDomain);
    const domainName = urlObject.hostname;
    const session = await shopify.config.sessionStorage.findSessionsByShop(
      domainName
    );

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      button: req.body.button,
      button_url: req.body.button_url,
      popup_bg: req.body.popup_bg,
      text_color: req.body.text_color,
      button_color: req.body.button_color,
      image: req.body.image,
      template: req.body.template,
    };

    if (popup) {
      try {
        await PopupDB.update(req.params.id, updateData);
        await createOrUpdateShopifyMetafield({
          key: "popup",
          session,
          value: JSON.stringify(updateData),
          namespace: FILE_KEY,
          type: "json",
        });
        const response = await PopupDB.read(req.params.id);
        res.status(200).send(response);
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
    const popup = await getPopupOr404(req, res);

    if (popup) {
      const formattedQrCode = await formatQrCodeResponse(req, res, [popup]);
      res.status(200).send(formattedQrCode[0]);
    }
  });

  app.delete("/api/popup/:id", async (req, res) => {
    const popup = await getPopupOr404(req, res);

    if (popup) {
      await PopupDB.delete(req.params.id);
      res.status(200).send();
    }
  });
}
