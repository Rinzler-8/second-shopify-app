import axios from "../plugins/axios";
import { showToast } from "../plugins/toast";

const ROOT_API = "/api/";

const create = (url, state) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${ROOT_API}/${url}`, {
        ...state,
      })
      .then(resolve)
      .catch(reject);
  });
};
const getDetail = (url, id, cancelToken) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${ROOT_API}/${url}/${id}`, {
        cancelToken: cancelToken,
      })
      .then((response) => {
        console.log(response, "response");
        resolve(response);
      })
      .catch((error) => {
        showToast({
          message: error.message,
          error: true,
        });
        reject();
      })
      .then(resolve);
  });
};

const update = (url, data) => {
  const { _id, ...rest } = data;
  let api = `${ROOT_API}/${url}`;
  if (_id) api = api + `/${_id}`;

  return new Promise((resolve, reject) => {
    axios
      .put(api, rest)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        showToast({
          message: error.message,
          error: true,
        });
        reject();
      })
      .then(resolve);
  });
};

const updateByShop = (url, data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${ROOT_API}/${url}`, data)
      .then((response) => {
        console.log(response, "response");
        resolve(response);
      })
      .catch((error) => {
        showToast({
          message: error.message,
          error: true,
        });
        reject();
      })
      .then(resolve);
  });
};

const bulkDelete = (url, ids = []) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${ROOT_API}/${url}`, {
        ids: ids.join(","),
        payload: {
          deleted: true,
        },
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        showToast({
          message: error.message,
          error: true,
        });
        reject();
      })
      .then(resolve);
  });
};

const _delete = (url, id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${ROOT_API}/${url}/${id}`, {})
      .then(resolve)
      .catch((error) => {
        showToast({ message: error.message, error: true });
        reject(error);
      });
  });
};

const bulkUpdate = (url, data) => {
  const { ids, ...rest } = data;
  return new Promise((resolve, reject) => {
    axios
      .put(`${ROOT_API}/${url}`, {
        ids: ids.join(","),
        payload: { ...rest },
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        showToast({
          message: error.message,
          error: true,
        });
        reject();
      })
      .then(resolve);
  });
};

export const getList = (url, params, cancelToken) => {
  params = Object.assign(
    {
      limit: 20,
      page: 1,
    },
    params
  );

  return new Promise((resolve, reject) => {
    axios
      .get(`${ROOT_API}/${url}`, {
        params: params,
        cancelToken: cancelToken,
      })
      .then((response) => {
        console.log(response, "response");
        resolve(response);
      })
      .catch((error) => {
        console.log(error, "errorrr");
        showToast({
          message: error.message,
          error: true,
        });
        reject();
      })
      .then(resolve);
  });
};

export const get = (url, params) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${ROOT_API}/${url}`, {
        params: params,
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        showToast({
          message: error.message,
          error: true,
        });
        reject();
      })
      .then(resolve);
  });
};

const API = {
  create,
  get,
  getDetail,
  getList,
  update,
  updateByShop,
  bulkDelete,
  delete: _delete,
  bulkUpdate,
};
export default API;
