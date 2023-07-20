import { useCallback, useEffect, useState } from "react";
import {
  AlphaCard,
  Page,
  Layout,
  LegacyCard,
  FormLayout,
  Checkbox,
  TextField,
} from "@shopify/polaris";
import { ContextProvider } from "./container";
import { useStore } from "./container";
import { Skeleton } from "./../modules/skeleton";
import { CancelToken } from "./../plugins/axios";
import RichText from './../components/richtext';

const Popup = () => {
  return (
    <ContextProvider>
      <PopupView />
    </ContextProvider>
  );
};

const PopupView = () => {
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
  const {
    active,
    popup_type,
    title,
    description,
    show_on_mobile,
    button,
    save_to,
    button_url,
    platforms,
  } = state;
  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  useEffect(() => {
    let result;
    const fetchData = async () => {
      try {
        result = await API.getList("popup", {}, source.token);
        console.log("Data details", result);
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
    setError(!save_to.length && !platforms.length);
    if (!save_to.length && !platforms.length) {
      return showToast({
        message: 'Please choose at least 1 option in the "Data collection"',
        error: true,
      });
    }
    setSaving(true);
    const saveData = { ...state, ...data };
    dispatch({ type: "setData", payload: saveData });
    delete saveData["updatedAt"];
    API.updateByShop("popup", saveData)
      .then((res) => {
        if (res.ok) {
          setPrevState({
            ...prevState,
            ...res.payload,
          });
          return showToast({
            message: "Updated successfully",
          });
        }
      })
      .finally(() => setSaving(false));
  };
  const handleChange = (key, value) => {
    dispatch({ type: "setData", payload: { [key]: value } });
  };
  const handleDelete = (data) => {
    showConfirm({
      title: `Delete this list?`,
      message: "This can’t be undone.",
      danger: true,
      confirm: "Delete",
    }).then((res) => {
      if (res) {
        const filterPlatforms = platforms.filter(
          (item) => item._id !== data._id
        );
        setError(!save_to.length && !filterPlatforms.length);
        if (!save_to.length && !filterPlatforms.length) {
          return showToast({
            message: 'Please choose at least 1 option in the "Data collection"',
            error: true,
          });
        }

        axios.delete(`/api/plugin/integration/lists/${data._id}`);
        const saveData = { ...state, platforms: filterPlatforms };
        dispatch({
          type: "setData",
          payload: {
            ...saveData,
          },
        });

        handleSave(saveData);
      }
    });
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
              <AlphaCard.Section>
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
                  {["collect_lead", "subscribe_to_discount"].includes(
                    popup_type
                  ) ? (
                    <FormLayout.Group>
                      <TextField
                        label={"Button"}
                        value={button}
                        onChange={(v) => handleChange("button", v)}
                      />
                    </FormLayout.Group>
                  ) : (
                    ""
                  )}
                  {["announcement"].includes(popup_type) && (
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
                  )}
                </FormLayout>
              </AlphaCard.Section>
            </LegacyCard>
            <LegacyCard title="Colors & Image" sectioned>
              <p>
                Use to follow a normal section with a secondary section to
                create a 2/3 + 1/3 layout on detail pages (such as individual
                product or order pages)
              </p>
            </LegacyCard>
          </LegacyCard>
        </Layout.Section>
        <Layout.Section>
          <LegacyCard title="Preview" sectioned>
            <p>Add tags to your order.</p>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  ) : (
    <Skeleton />
  );
};

export default Popup;
