import { useCallback, useEffect, useState } from "react";
import {
  Page,
  Layout,
  LegacyCard,
  FormLayout,
  Checkbox,
  TextField,
  PageActions,
  SkeletonBodyText,
} from "@shopify/polaris";
import RichText from "./richtext";
import { useStore } from "../pages/container";
import LayoutSection from "./../modules/layoutSection";
import { useAuthenticatedFetch } from "./../hooks/useAuthenticatedFetch";
import { CancelToken } from "./../plugins/axios";
import PopupTemplate from "./templates";
import PreviewPopup from "./preview";

export function MainPage({ loading }) {
  const fetch = useAuthenticatedFetch();
  const [ready, setReady] = useState(true);
  const [saving, setSaving] = useState(false);
  const { state, dispatch } = useStore();
  const source = CancelToken.source();
  const [activeModal, setActiveModal] = useState(false);
  const handleModalChange = useCallback(
    () => setActiveModal(!activeModal),
    [activeModal]
  );
  const { active, title, description, button, button_url } = state;

  console.log("pop ", title);

  const handleSave = async (data = {}) => {
    setSaving(true);
    const saveData = { ...state, ...data };
    dispatch({ type: "setData", payload: saveData });
    delete saveData["updatedAt"];
    await fetch(`api/popup/64bcb0add4947c43026f9a74`, {
      method: "PATCH",
      body: JSON.stringify(saveData),
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        if (res.ok) {
          // return showToast({
          //   message: "Updated successfully",
          // });
        }
      })
      .finally(() => setSaving(false));
  };
  const handleChange = (key, value) => {
    dispatch({ type: "setData", payload: { [key]: value } });
  };

  return ready ? (
    <Page loading={loading} fullWidth>
      <Layout>
        <Layout.Section secondary>
          <LegacyCard>
            <LegacyCard title="Status" sectioned>
              <FormLayout>
                <Checkbox
                  label={"Active"}
                  checked={active}
                  onChange={(v) => handleChange("active", v)}
                />
              </FormLayout>
            </LegacyCard>

            <LegacyCard title="Content settings" sectioned>
              <FormLayout>
                <TextField
                  label={"Title"}
                  value={title}
                  onChange={(v) => handleChange("title", v)}
                />
                <RichText
                  label={"Description"}
                  value={description}
                  compact
                  onChange={(e) => {
                    handleChange("description", e);
                  }}
                />
                <FormLayout.Group>
                  <TextField
                    label={"Button"}
                    value={button}
                    onChange={(v) => handleChange("button", v)}
                  />
                  <TextField
                    label={"Button link"}
                    value={button_url}
                    placeholder={"https://"}
                    onChange={(v) => handleChange("button_url", v)}
                  />
                </FormLayout.Group>
              </FormLayout>
            </LegacyCard>
          </LegacyCard>

          <PopupTemplate handleSave={handleSave} />
        </Layout.Section>
        <LayoutSection isStuck>
          <LegacyCard title={"Preview"}>
            <LegacyCard.Section>
              <PreviewPopup />
            </LegacyCard.Section>
          </LegacyCard>
          <PageActions
            primaryAction={{
              content: "Save",
              loading: saving,
              onAction: () => handleSave(),
            }}
          />
        </LayoutSection>
      </Layout>
    </Page>
  ) : (
    <SkeletonBodyText />
  );
}
