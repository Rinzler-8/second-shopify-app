import { BrowserRouter } from "react-router-dom";
import { Frame } from "@shopify/polaris";
import Routes from "./Routes";

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
import ToastFlash, { toastRef } from "../frontend/plugins/toast";

export default function App() {
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <Frame>
              <ToastFlash ref={toastRef} />
              <Routes pages={pages} />
            </Frame>
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
