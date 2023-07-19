import {
  Button,
  Card,
  EmptyState,
  FormLayout,
  Modal,
  Select,
  Spinner,
} from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import API from "@helpers/api";
import { navigate } from "@reach/router";
import { initialData } from "../pages/integration/initialData";
import { showToast } from "@plugins/toast";
import axios from "@plugins/axios";
const PlatformModal = ({
  setActiveModalIntegration,
  useStore,
  plugin,
  link_api,
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { state, dispatch } = useStore();
  const [dataPlatform, setDataPlatform] = useState({
    name: "",
    list_id: "",
    plugin: plugin,
    list_name: "",
  });
  const [checkList, setCheckList] = useState(true);
  const [activeModalLists, setActiveModalLists] = useState(false);
  const [activeModalPlatform, setActiveModalPlatform] = useState(true);
  const [inputOptionList, setInputOptionList] = useState([]);
  const { platforms, shop } = state;
  const [integrations, setIntegrations] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        setSaving(true);
        const data = await axios.get("/api/plugin/integration");
        if (data.ok) {
          setIntegrations(data.payload);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setSaving(false);
      }
    };
    getData();
    return () => {
      setIntegrations([]);
    };
  }, []);
  const handlePlatformList = async (name) => {
    setActiveModalPlatform(false);
    setActiveModalLists(true);
    setLoading(true);
    let result;
    const data = integrations?.find((item) => item.platform === name);
    if (data === undefined) return;
    result = await API.create("integration/lists", {
      api_key: data.api_key,
      platform: data.platform,
    });
    const { platform, api_key, lists } = result.payload;
    if (lists !== undefined && lists.length !== 0) {
      const optionList = { platform: platform, api_key: api_key, lists: lists };
      setInputOptionList(
        optionList.lists.map((item) => ({
          label: item.list_name,
          value: item.list_id,
        }))
      );
      setDataPlatform({
        ...dataPlatform,
        list_id: lists[0].list_id,
        name: name,
        list_name: lists[0].list_name,
      });
      setLoading(false);
      setCheckList(true);
    } else {
      setCheckList(false);
      setLoading(false);
    }
  };

  const handleSubmitPlatform = async () => {
    const { name, list_id, list_name } = dataPlatform;
    try {
      const data = await API.create("integration/lists/item", {
        list_id,
        name,
        shop: shop,
        plugin: plugin,
        list_name,
      });
      if (data.ok) {
        let saveData;
        if (platforms.some((item) => item.list_id === list_id)) {
          saveData = state;
        } else {
          saveData = {
            ...state,
            platforms: [...state.platforms, { ...data.payload, active: true }],
          };
        }
        dispatch({ type: "setData", payload: saveData });
        setSaving(true);
        setActiveModalIntegration(false);
        API.updateByShop(link_api, {
          ...saveData,
        })
          .then((res) => {
            if (res.ok) {
              return showToast({
                message: "Updated successfully",
              });
            }
          })
          .finally(() => setSaving(false));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitOmnisend = async () => {
    try {
      const data = await API.create("integration/lists/item", {
        name: "omnisend",
        shop: shop,
        plugin: plugin,
        list_id: "",
        list_name: "",
      });
      if (data.ok) {
        let saveData;
        if (platforms.some((item) => item.name === "omnisend")) {
          saveData = state;
        } else {
          saveData = {
            ...state,
            platforms: [...platforms, { ...data.payload, active: true }],
          };
        }
        setSaving(true);
        dispatch({
          type: "setData",
          payload: saveData,
        });
        API.updateByShop(link_api, saveData)
          .then((res) => {
            if (res.ok) {
              setActiveModalIntegration(false);
              return showToast({
                message: "Updated successfully",
              });
            }
          })
          .finally(() => setSaving(false));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleModal = () => {
    setActiveModalIntegration((prev) => !prev);
  };

  const handleDataPlatform = (v) => {
    inputOptionList.forEach((item) => {
      if (v === item.value) {
        setDataPlatform(() => ({
          ...dataPlatform,
          list_id: v,
          list_name: item.label,
        }));
      }
    });
  };
  return (
    <div>
      <Modal
        title={
          activeModalPlatform && integrations.length !== 0
            ? "Select a platform"
            : activeModalLists
            ? checkList && !loading && `Integrate with ${dataPlatform.name}`
            : ""
        }
        open={true}
        onClose={() => toggleModal()}
        primaryAction={
          activeModalLists &&
          checkList &&
          !loading && {
            content: "Add",
            onAction: () => handleSubmitPlatform(dataPlatform.name),
          }
        }
      >
        {activeModalPlatform && (
          <Modal.Section>
            {saving ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Spinner size="large" />
              </div>
            ) : integrations.length !== 0 ? (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    width: "100%",
                  }}
                >
                  {initialData.map((item, key) => {
                    let check = false;
                    if (
                      integrations.some(
                        (integration) => integration.platform === item.name
                      )
                    )
                      check = true;
                    return (
                      check && (
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            if (item.name !== "omnisend") {
                              handlePlatformList(item.name);
                            } else {
                              handleSubmitOmnisend();
                              setActiveModalIntegration(false);
                            }
                          }}
                          key={key}
                        >
                          <Card.Section>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                              }}
                            >
                              <img
                                src={item.img}
                                alt={item.name}
                                style={{ maxWidth: "50px" }}
                              />
                              <p style={{ marginTop: "20px" }}>{item.label}</p>
                            </div>
                          </Card.Section>
                        </div>
                      )
                    );
                  })}
                </div>
                <div
                  style={{
                    marginTop: "30px",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <Button onClick={() => navigate("/manage/integrations")}>
                    Add another platform
                  </Button>
                </div>
              </>
            ) : (
              <EmptyState
                heading="You don't have any integration"
                action={{
                  content: "Add integration",
                  onAction: () => navigate("/manage/integrations"),
                }}
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                fullWidth
              />
            )}
          </Modal.Section>
        )}
        {activeModalLists && (
          <Modal.Section>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Spinner size="large" />
              </div>
            ) : checkList ? (
              <FormLayout>
                {dataPlatform.name !== "omnisend" && (
                  <Select
                    label={"Select list"}
                    options={inputOptionList}
                    onChange={(v) => handleDataPlatform(v)}
                    value={dataPlatform.list_id}
                  />
                )}
              </FormLayout>
            ) : (
              <EmptyState
                heading="You don't have any lists for this platform. Go to add and come back later."
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                fullWidth
              />
            )}
          </Modal.Section>
        )}
      </Modal>
    </div>
  );
};

export default PlatformModal;
