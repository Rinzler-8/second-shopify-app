import ReactDOM from "react-dom";

import App from "./App";
import { initI18n } from "./utils/i18nUtils";
// import '@shopify/polaris/dist/styles.css'
import "./styles/cssgrid.min.css";
import "./styles/globals.scss";
import "./styles/helpers.scss";

// Ensure that locales are loaded before rendering the app
initI18n().then(() => {
  ReactDOM.render(<App />, document.getElementById("app"));
});
