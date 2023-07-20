// import { useCallback, useEffect, useState } from "react";
// import {
//   Layout,
//   Card,
//   TextField,
//   FormLayout,
//   Checkbox,
//   ContextualSaveBar,
//   Tabs,
//   PageActions,

// } from "@shopify/polaris";
// import {
//   ContextProvider,

// } from "./container";
// import Page from "@modules/page";
// import LayoutSection from "@modules/layoutSection";
// import { useStore } from "./container";
// import { navigate } from "@reach/router";
// import PreviewPopup from "./preview";
// import API from "@helpers/api";
// import { showToast } from "@plugins/toast";
// import { Skeleton } from "@modules/skeleton";
// import axios, { CancelToken } from "@plugins/axios";
// import RichText from "@components/richtext";
// import { isEqual, omit } from "lodash";
// import { showConfirm } from "@plugins/confirm";
// import { useAuthStore } from '@container/Auth';
// const Popup = () => {
//   return (
//     <ContextProvider>
//       <PopupView />
//     </ContextProvider>
//   );
// };

// const PopupView = () => {
//   const [activeModalIntegration, setActiveModalIntegration] = useState(false);
//   const [error, setError] = useState(false);
//   const [ready, setReady] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [selected, setSelected] = useState(0);
//   const { state, dispatch } = useStore();
//   const source = CancelToken.source();
//   const [prevState, setPrevState] = useState({
//     ...state,
//     description: `<p>${state.description}</p>`,
//   });
//   const [activeModal, setActiveModal] = useState(false);
//   const isEqualState = isEqual(
//     omit(state, [
//       "updatedAt",
//       "createdAt",
//       "auto_trigger",
//       "deleted",
//       "__v",
//       "_id",
//       "shop",
//     ]),
//     omit(prevState, [
//       "updatedAt",
//       "createdAt",
//       "auto_trigger",
//       "deleted",
//       "__v",
//       "_id",
//       "shop",
//     ])
//   );
//   const handleModalChange = useCallback(
//     () => setActiveModal(!activeModal),
//     [activeModal]
//   );
//   const {
//     active,
//     popup_type,
//     title,
//     description,
//     show_on_mobile,
//     success_text,
//     button,
//     save_to,
//     email_placeholder,
//     coupon,
//     trigger,
//     delay_show,
//     repeat_open,
//     display_on,
//     updatedAt,
//     copy_button,
//     button_url,
//     teaser_activate,
//     teaser_title,
//     teaser_when,
//     teaser_position,
//     shop,
//     platforms,
//   } = state;
//   const handleTabChange = useCallback(
//     (selectedTabIndex) => setSelected(selectedTabIndex),
//     []
//   );

//   useEffect(() => {
//     const handleReloadPage = (e) => {
//       e.preventDefault();
//       e.returnValue = "";
//     };
//     if (isEqualState === false)
//       window.addEventListener("beforeunload", handleReloadPage);
//     return () => window.removeEventListener("beforeunload", handleReloadPage);
//   }, [isEqualState]);

//   useEffect(() => {
//     let result;
//     const fetchData = async () => {
//       try {
//         result = await API.getList("popup", {}, source.token);
//         console.log("Data details", result);
//         if (result && result.ok) {
//           dispatch({ type: "setData", payload: result.payload });
//           if (result.payload) {
//             setPrevState({ ...prevState, ...result.payload });
//           }
//           setReady(true);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchData();
//     return () => source.cancel();
//   }, []);

//   const handleSave = async (data = {}) => {
//     setError(!save_to.length && !platforms.length);
//     if (!save_to.length && !platforms.length) {
//       return showToast({
//         message: 'Please choose at least 1 option in the "Data collection"',
//         error: true,
//       });
//     }
//     setSaving(true);
//     const saveData = { ...state, ...data };
//     dispatch({ type: "setData", payload: saveData });
//     delete saveData["updatedAt"];
//     API.updateByShop("popup", saveData)
//       .then((res) => {
//         if (res.ok) {
//           setPrevState({
//             ...prevState,
//             ...res.payload,
//           });
//           return showToast({
//             message: "Updated successfully",
//           });
//         }
//       })
//       .finally(() => setSaving(false));
//   };
//   const handleChange = (key, value) => {
//     dispatch({ type: "setData", payload: { [key]: value } });
//   };
//   const renderChildren = useCallback(
//     (isSelected) =>
//       isSelected && (
//         <div style={{ width: 300 }}>
//           <TextField
//             label="Delay time to show"
//             labelHidden
//             onChange={(v) => handleChange("delay_show", Number(v))}
//             value={delay_show + ""}
//             suffix={"seconds"}
//           />
//         </div>
//       ),
//     [handleChange, delay_show]
//   );
//   const handleDelete = (data) => {
//     showConfirm({
//       title: `Delete this list?`,
//       message: "This can’t be undone.",
//       danger: true,
//       confirm: "Delete",
//     }).then((res) => {
//       if (res) {
//         const filterPlatforms = platforms.filter(
//           (item) => item._id !== data._id
//         );
//         setError(!save_to.length && !filterPlatforms.length);
//         if (!save_to.length && !filterPlatforms.length) {
//           return showToast({
//             message: 'Please choose at least 1 option in the "Data collection"',
//             error: true,
//           });
//         }

//         axios.delete(`/api/plugin/integration/lists/${data._id}`);
//         const saveData = { ...state, platforms: filterPlatforms };
//         dispatch({
//           type: "setData",
//           payload: {
//             ...saveData,
//           },
//         });

//         handleSave(saveData);
//       }
//     });
//   };
//   const tabs = [
//     {
//       id: "general",
//       content: "General",
//       accessibilityLabel: "general-settings",
//       panelID: "general-content",
//     },
//     {
//       id: "design",
//       content: "Design",
//       panelID: "design-content",
//     },
//     {
//       id: "displays",
//       content: "Display",
//       panelID: "display-settings",
//     },
//   ];

//   const { shop_domain } = useAuthStore();
//   return ready ? (
//     <Page
//       title="Popup settings"
//       subtitle={
//         "Create coupon or newsletter popup to interact with your customer."
//       }
//       breadcrumbs={[
//         {
//           content: "Boost conversion",
//           onAction: () =>
//             isEqualState ? navigate("/boost-conversion") : handleModalChange(),
//         },
//       ]}
//       fullWidth
//     >
//       {!isEqualState && (
//         <ContextualSaveBar
//           fullWidth
//           saveAction={{
//             onAction: () => handleSave(),
//             loading: saving,
//             disabled: false,
//           }}
//           discardAction={{
//             onAction: () => handleModalChange(),
//           }}
//         />
//       )}
//       <Layout>
//         <Layout.Section secondary>
//           <Card>
//             <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
//               {selected === 0 && (
//                 <>
//                   <Card sectioned title={"Status"}>
//                     <FormLayout>
//                       <Checkbox
//                         label={"Active"}
//                         checked={active}
//                         onChange={(v) => handleChange("active", v)}
//                       />
//                       <Checkbox
//                         label={"Show on mobile"}
//                         checked={show_on_mobile}
//                         disabled={!active}
//                         onChange={(v) => handleChange("show_on_mobile", v)}
//                       />
//                     </FormLayout>
//                   </Card>
//                   <Card title={"Content settings"}>
//                     <Card.Section>
//                       <FormLayout>
//                         <TextField
//                           label={"Title"}
//                           value={title}
//                           onChange={(v) => handleChange("title", v)}
//                         />
//                         <RichText
//                           label={"Description"}
//                           value={description}
//                           compact
//                           onChange={(e) => {
//                             handleChange("description", e);
//                             console.log(e, "description");
//                           }}
//                         />
//                         {["announcement"].includes(popup_type) && (
//                           <FormLayout.Group>
//                             <TextField
//                               label={"Button"}
//                               value={button}
//                               onChange={(v) => handleChange("button", v)}
//                             />
//                             <TextField
//                               label={"Button link"}
//                               value={button_url}
//                               placeholder={"https://"}
//                               onChange={(v) => handleChange("button_url", v)}
//                             />
//                           </FormLayout.Group>
//                         )}
//                       </FormLayout>
//                     </Card.Section>
//                   </Card>
//                 </>
//               )}
//             </Tabs>
//           </Card>
//         </Layout.Section>
//         <LayoutSection isStuck>
//           <Card title={"Preview"}>
//             <Card.Section>
//               <PreviewPopup />
//             </Card.Section>
//           </Card>
//           <PageActions
//             primaryAction={{
//               content: "Save",
//               loading: saving,
//               onAction: () => handleSave(),
//             }}
//           />
//         </LayoutSection>
//       </Layout>
//     </Page>
//   ) : (
//     <Skeleton />
//   );
// };

// export default Popup;
