import { useNavigate, TitleBar, Loading } from "@shopify/app-bridge-react";
import { LegacyCard, Layout, Page, SkeletonBodyText } from "@shopify/polaris";
import { useAppQuery } from "../hooks";
import { MainPage } from "./../components/main";
import { ContextProvider } from "./container";

export default function PopupView() {
  const {
    data: PopupData,
    isLoading,
    isRefetching,
  } = useAppQuery({
    url: "/api/popup",
  });

  const popupMarkup =
    PopupData && PopupData.length ? (
      <ContextProvider PopupData={PopupData}>
        <MainPage loading={isRefetching} />
      </ContextProvider>
    ) : null;

  const loadingMarkup = isLoading ? (
    <LegacyCard sectioned>
      <Loading />
      <SkeletonBodyText />
    </LegacyCard>
  ) : null;

  return (
    <Page fullWidth={!!popupMarkup}>
      <Layout>
        <Layout.Section>
          {loadingMarkup}
          {popupMarkup}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
