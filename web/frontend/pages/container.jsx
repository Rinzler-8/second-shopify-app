import { createContext, useContext, useReducer } from "react";

export const titles = {
  announcement: "Special gift for our subscribers",
};

export const success_messages = {
  subscribe_to_discount: "Congratulation ! You have got this coupon.",
};

export const button_texts = {
  announcement: "Get my 20% off",
};

export const descriptions = {
  announcement: "Enter your email to get 50% off for all products.",
};

export const initialState = {
  active: false,
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
  updatedAt: "",
};

const Context = createContext(initialState);

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "setData":
        return {
          ...state,
          ...action.payload,
        };
      default:
        throw new Error();
    }
  }, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export const useStore = () => useContext(Context);
