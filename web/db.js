/*
  This file interacts with the app's database and is used by the app's REST APIs.
*/

import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
import shopify from "./shopify.js";

const uri = "mongodb://localhost:27017"; // Replace with your MongoDB URI
const client = new MongoClient(uri);
const DEFAULT_PURCHASE_QUANTITY = 1;
let db;

async function connectToDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    db = client.db("popup");
    const collections = {
      popupCollection: db.collection("pop_ins"),
      shopInfoCollection: db.collection("shop_info"),
      // Add more collections as needed
    };
    return collections;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

let connect = await connectToDB();

export const ShopInfoDB = {
  shopInfoTableName: "shop_info",
  shopInfoCollection: connect.shopInfoCollection,

  create: async function ({ shopDomain, name, country, phone, owner }) {
    await this.ready;

    const document = {
      shopDomain,
      name,
      country,
      phone,
      owner,
    };

    const result = await this.shopInfoCollection.insertOne(document);
    return result.insertedId;
  },

  read: async function (id) {
    await this.ready;

    const query = { _id: new ObjectId(id) };
    const shop = await this.shopInfoCollection.findOne(query);

    return shop;
  },

  list: async function () {
    await this.ready;
    const results = await this.shopInfoCollection.find().toArray();

    return results;
  },

  update: async function (id, { shopDomain, name, country, phone, owner }) {
    await this.ready;

    const query = { _id: new ObjectId(id) };
    const updateDocument = {
      $set: {
        shopDomain,
        name,
        country,
        phone,
        owner,
      },
    };

    await this.shopInfoCollection.updateOne(query, updateDocument);
    return true;
  },
};

export const PopupDB = {
  popupTableName: "pop_ins",
  db: null,
  ready: null,
  popupCollection: connect.popupCollection,

  create: async function ({
    shopDomain,
    title,
    description,
    text,
    link,
    backgroundColor,
    textColor,
    btnColor,
    image,
  }) {
    await this.ready;

    const document = {
      shopDomain,
      title,
      description,
      text,
      link,
      backgroundColor,
      textColor,
      btnColor,
      image,
      createdAt: new Date(),
    };

    const result = await this.popupCollection.insertOne(document);
    return result.insertedId;
  },

  read: async function (id) {
    await this.ready;

    const query = { _id: new ObjectId(id) };
    const popup = await this.popupCollection.findOne(query);
    return popup;
  },

  update: async function (
    id,
    {
      title,
      description,
      text,
      link,
      backgroundColor,
      textColor,
      btnColor,
      image,
    }
  ) {
    await this.ready;

    const query = { _id: new ObjectId(id) };
    const updateDocument = {
      $set: {
        title,
        description,
        text,
        link,
        backgroundColor,
        textColor,
        btnColor,
        image,
      },
    };

    await this.popupCollection.updateOne(query, updateDocument);
    return true;
  },

  list: async function (shopDomain) {
    await this.ready;

    const query = { shopDomain };
    const results = await this.popupCollection.find(query).toArray();

    return results;
  },

  delete: async function (id) {
    await this.ready;

    const query = { _id: new ObjectId(id) };
    await this.popupCollection.deleteOne(query);
    return true;
  },

  /* The btnColor URL for a QR code is generated at query time */
  generateQrcodeDestinationUrl: function (popup) {
    return `${shopify.api.config.hostScheme}://${shopify.api.config.hostName}/popup/${popup._id}/scan`;
  },

  /* Private */

  /*
    Used to check whether to create the collection.
    Also used to make sure the collection is set up before the server starts.
  */

  __hasPopupCollection: async function () {
    const collections = await db
      .listCollections({ name: this.popupTableName })
      .toArray();
    return collections.length > 0;
  },

  init: async function () {
    try {
      this.ready = Promise.resolve();

      const hasQrCodesCollection = await this.__hasPopupCollection();

      if (!hasQrCodesCollection) {
        const indexes = [
          { key: { shopDomain: 1 } },
          { key: { createdAt: 1 }, expireAfterSeconds: 86400 }, // Auto-delete documents after 24 hours
        ];
        await connect.createCollection(this.popupTableName);
        await connect.createIndexes(this.popupTableName, indexes);
        await connect.createCollection(this.shopInfoTableName);
        await connect.createIndexes(this.shopInfoTableName, indexes);
      }
    } catch (err) {
      console.error("Error initializing MongoDB:", err);
    }
  },
};
