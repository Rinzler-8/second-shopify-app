import { createContext, useContext, useReducer } from "react";

export const titles = {
  collect_lead: "Don't want to miss anything?",
  give_coupon: "Special offer",
  subscribe_to_discount: "Special gift for our subscribers",
  announcement: "Special gift for our subscribers",
};

export const success_messages = {
  collect_lead:
    "Congratulation! You've successfully joined our list. Stay tuned for future updates.",
  subscribe_to_discount: "Congratulation ! You have got this coupon.",
};

export const button_texts = {
  collect_lead: "Subscribe",
  subscribe_to_discount: "Get my 20% off",
  announcement: "Get my 20% off",
};

export const descriptions = {
  collect_lead:
    "Be the first to see new arrivals, exclusive deals and much more",
  give_coupon:
    "Before you leave, grab the offer ! Enter this coupon code at checkout to get 50% off.",
  subscribe_to_discount: "Enter your email to get 50% off for all products.",
  announcement: "Enter your email to get 50% off for all products.",
};

export const initialState = {
  active: false,
  popup_type: "collect_lead", // Offer discount, subscribe to show discount, announcement
  title: "Don't want to miss anything?",
  description:
    "Be the first to see new arrivals, exclusive deals and much more.",
  success_text:
    "Congratulation! You've successfully joined our list. Stay tuned for future updates.",
  button: "Subscribe",
  copy_button: "Copy",
  button_url: "",
  popup_bg: "#ffffff",
  text_color: "#000",
  button_color: "#000",
  auto_apply: true,
  platforms: [],
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
