import { createContext, useContext, useReducer } from "react";
import { useAppQuery } from "../hooks/useAppQuery";

export const initialState = (PopupData) => ({
  ...PopupData[0],
});

const Context = createContext(initialState);

export const ContextProvider = ({ children, PopupData }) => {
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
  }, initialState(PopupData)); // Pass PopupData to initialState

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export const useStore = () => useContext(Context);
