import { useCallback, useEffect, useState } from "react";
import {
  Page,
  Layout,
  LegacyCard,
  FormLayout,
  Checkbox,
  TextField,
  PageActions,
} from "@shopify/polaris";
import { ContextProvider } from "./container";
import { useStore } from "./container";
import { Skeleton } from "./../modules/skeleton";
import { CancelToken } from "./../plugins/axios";
import RichText from "./../components/richtext";
import PopupTemplate from "./templates";
import LayoutSection from "./../modules/layoutSection";
import PreviewPopup from "./preview";
import API from "./../helpers/api";
import { useAuthenticatedFetch } from "./../hooks/useAuthenticatedFetch";
import { useAppQuery } from "./../hooks/useAppQuery";

const Popup = () => {
  return (
    <ContextProvider>
      <PopupView />
    </ContextProvider>
  );
};

const PopupView = () => {
  const fetch = useAuthenticatedFetch();
  const [activeModalIntegration, setActiveModalIntegration] = useState(false);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(0);
  const { state, dispatch } = useStore();
  const source = CancelToken.source();
  const [prevState, setPrevState] = useState({
    ...state,
    description: `<p>${state.description}</p>`,
  });
  const [activeModal, setActiveModal] = useState(false);
  const handleModalChange = useCallback(
    () => setActiveModal(!activeModal),
    [activeModal]
  );
  const { active, title, description, button, save_to, button_url } = state;

  // const {
  //   data: popup,
  //   isLoading,
  //   isRefetching,
  // } = useAppQuery({
  //   url: "/api/popup",
  // });
  // console.log("popup ", popup);

  useEffect(() => {
    let result;
    const fetchData = async () => {
      try {
        result = await fetch("api/popup", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (result && result.ok) {
          dispatch({ type: "setData", payload: result.payload });
          if (result.payload) {
            setPrevState({ ...prevState, ...result.payload });
          }
          setReady(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    return () => source.cancel();
  }, []);

  const handleSave = async (data = {}) => {
    setSaving(true);
    const saveData = { ...state, ...data };
    dispatch({ type: "setData", payload: saveData });
    console.log("saveData ", JSON.stringify(saveData));
    delete saveData["updatedAt"];
    await fetch(`api/popup/64bb47c65c1c2158ab073e17`, {
      method: "PATCH",
      body: JSON.stringify(saveData),
    })
      .then((res) => {
        if (res.ok) {
          setPrevState({
            ...prevState,
            ...res.payload,
          });
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
    <Page fullWidth>
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
                    console.log(e, "description");
                  }}
                />
                <FormLayout.Group>
                  <TextField
                    label={"Button"}
                    value={button}
                    // onChange={(v) => handleChange("button", v)}
                  />
                  <TextField
                    label={"Button link"}
                    value={button_url}
                    placeholder={"https://"}
                    // onChange={(v) => handleChange("button_url", v)}
                  />
                </FormLayout.Group>
              </FormLayout>
            </LegacyCard>
          </LegacyCard>

          {/* <PopupTemplate handleSave={handleSave} /> */}
          <PopupTemplate />
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
    <Skeleton />
  );
};

export default Popup;
