import { LegacyCard, EmptyState, Page } from "@shopify/polaris";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <Page>
      <LegacyCard>
        <LegacyCard.Section>
          <EmptyState heading={t("NotFound.heading")}>
            <p>{t("NotFound.description")}</p>
          </EmptyState>
        </LegacyCard.Section>
      </LegacyCard>
    </Page>
  );
}
