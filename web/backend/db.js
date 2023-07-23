/*
  This file interacts with the app's database and is used by the app's REST APIs.
*/

import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

const uri = "mongodb://localhost:27017"; // Replace with your MongoDB URI
const client = new MongoClient(uri);
let db;

async function connectToDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    db = client.db("popup");
    const collections = {
      popupCollection: db.collection("pop_ins"),
      shopInfoCollection: db.collection("shop_info"),
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

  create: async function ({
    shopDomain,
    name,
    country,
    phone,
    owner,
    deleted,
  }) {
    await this.ready;

    const document = {
      shopDomain,
      name,
      country,
      phone,
      owner,
      deleted,
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
  readDomain: async function (shopDomain) {
    await this.ready;

    const query = { shopDomain };
    const shop = await this.shopInfoCollection.findOne(query);

    return shop;
  },

  list: async function () {
    await this.ready;
    const results = await this.shopInfoCollection.find().toArray();

    return results;
  },

  update: async function (
    shopDomain,
    { name, country, phone, owner, deleted }
  ) {
    await this.ready;

    const query = { shopDomain };
    const updateDocument = {
      $set: {
        name,
        country,
        phone,
        owner,
        deleted: true,
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
    active,
    title,
    description,
    button,
    button_url,
    popup_bg,
    text_color,
    button_color,
    image,
    template
  }) {
    await this.ready;

    const document = {
      shopDomain,
      active,
      title,
      description,
      button,
      button_url,
      popup_bg,
      text_color,
      button_color,
      image,
      template,
      createdAt: new Date(),
    };

    const result = await this.popupCollection.insertOne(document);
    return result.insertedId;
  },

  read: async function (id) {
    await this.ready;

    const query = { _id: new ObjectId(id) };
    const shop = await this.popupCollection.findOne(query);

    return shop;
  },

  readDomain: async function (shopDomain) {
    await this.ready;

    const query = { shopDomain };
    const shop = await this.popupCollection.findOne(query);

    return shop;
  },

  updateDomain: async function (
    shopDomain,
    {
      active,
      title,
      description,
      button,
      button_url,
      popup_bg,
      text_color,
      button_color,
      image,
      template
    }
  ) {
    await this.ready;

    const query = { shopDomain };
    const updateDocument = {
      $set: {
        active,
        title,
        description,
        button,
        button_url,
        popup_bg,
        text_color,
        button_color,
        image,
        template
      },
    };

    await this.popupCollection.updateOne(query, updateDocument);
    return true;
  },

  update: async function (
    id,
    {
      active,
      title,
      description,
      button,
      button_url,
      popup_bg,
      text_color,
      button_color,
      image,
      template
    }
  ) {
    await this.ready;

    const query = { _id: new ObjectId(id) };
    const updateDocument = {
      $set: {
        active,
        title,
        description,
        button,
        button_url,
        popup_bg,
        text_color,
        button_color,
        image,
        template
      },
    };
    await this.popupCollection.updateOne(query, updateDocument);
    return true;
  },

  list: async function (shopDomain) {
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

      const hasPopupCollection = await this.__hasPopupCollection();

      if (!hasPopupCollection) {
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
PopupDB.init();
