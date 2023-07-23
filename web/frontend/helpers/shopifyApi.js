import customInstance from "../plugins/axios";

const SHOPIFY_API = "/api/";

export const getProducts = (params, cancelToken) => {
  params = Object.assign(
    {
      first: 100,
    },
    params
  );
  return new Promise((resolve) => {
    customInstance
      .get(`${SHOPIFY_API}/product`, {
        params: params,
        cancelToken: cancelToken,
      })
      .then((response) => {
        if (response.ok && response.payload) resolve(response.payload.products);
      })
      .catch(function (error) {})
      .then(resolve);
  });
};

export const getCollections = (params, cancelToken) => {
  params = Object.assign(
    {
      first: 100,
    },
    params
  );
  return new Promise((resolve) => {
    customInstance
      .get(`${SHOPIFY_API}/collection`, {
        params: params,
        cancelToken: cancelToken,
      })
      .then((response) => {
        if (response.ok && response.payload)
          resolve(response.payload.collections);
      })
      .catch(function (error) {})
      .then(resolve);
  });
};

export const installTheme = ({
  demo_id,
  role,
  namespace,
  evanto_theme_id,
  version,
  update = false,
  import_data_from,
  os_version = "1.0",
}) => {
  let url = `${SHOPIFY_API}/theme/admin`;
  return new Promise((resolve, reject) => {
    customInstance
      .post(url, {
        demo_id,
        role,
        namespace,
        evanto_theme_id,
        version,
        os_version,
        update,
        import_data_from,
      })
      .then((response) => {
        resolve(response);
      })
      .catch(reject)
      .then(resolve);
  });
};

export const uploadAsset = ({ theme_id, asset }) => {
  let url = `${SHOPIFY_API}/theme/asset`;
  return new Promise((resolve, reject) => {
    customInstance
      .post(url, {
        theme_id,
        asset,
      })
      .then((response) => {
        resolve(response);
      })
      .catch(reject)
      .then(resolve);
  });
};

export const getThemesMap = () => {
  let url = `${SHOPIFY_API}/theme/license-theme-map`;
  return new Promise((resolve, reject) => {
    customInstance
      .get(url)
      .then((response) => {
        resolve(response);
      })
      .catch(reject)
      .then(resolve);
  });
};

export const getPublicTheme = () => {
  let url = `${SHOPIFY_API}/theme/public`;
  return new Promise((resolve, reject) => {
    customInstance
      .get(url)
      .then((response) => {
        resolve(response);
      })
      .catch(reject)
      .then(resolve);
  });
};

export const getThemeList = () => {
  let url = `${SHOPIFY_API}/theme/admin`;
  return new Promise((resolve, reject) => {
    customInstance
      .get(url)
      .then((response) => {
        resolve(response);
      })
      .catch(reject)
      .then(resolve);
  });
};

export const verifyTheme = (data) => {
  let url = `${SHOPIFY_API}/theme/verify`;
  return new Promise((resolve, reject) => {
    customInstance
      .post(url, {
        ...data,
      })
      .then((response) => {
        resolve(response);
      })
      .catch(reject)
      .then(resolve);
  });
};

const ShopifyAPI = {
  getProducts,
  getCollections,
  installTheme,
  uploadAsset,
  getThemesMap,
  getPublicTheme,
  getThemeList,
  verifyTheme,
};
export default ShopifyAPI;
