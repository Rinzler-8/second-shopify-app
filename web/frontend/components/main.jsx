import { useState } from "react";
import {
  Page,
  Layout,
  LegacyCard,
  FormLayout,
  TextField,
  PageActions,
} from "@shopify/polaris";
import { useAuthenticatedFetch } from "./../hooks/useAuthenticatedFetch";
import RichText from "./richtext";
import { useStore } from "../pages/container";
import LayoutSection from "./../modules/layoutSection";
import PopupTemplate from "./templates";
import PreviewPopup from "./preview";
import { showToast } from "./../plugins/toast";

export function MainPage({ loading }) {
  const fetch = useAuthenticatedFetch();
  const [saving, setSaving] = useState(false);
  const { state, dispatch } = useStore();
  const { title, description, button, button_url } = state;

  const handleSave = async (data = {}) => {
    setSaving(true);
    const saveData = { ...state, ...data };
    dispatch({ type: "setData", payload: saveData });
    delete saveData["updatedAt"];
    await fetch(`api/popup/${state._id}`, {
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

  return (
    <Page loading={loading} fullWidth>
      <Layout>
        <Layout.Section secondary>
          <LegacyCard>
            <LegacyCard title="Content settings" sectioned>
              <FormLayout>
                <TextField
                  label={"Title"}w
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
  );
}
