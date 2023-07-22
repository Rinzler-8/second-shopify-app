import styled from "styled-components";
import ImageSelect from "../components/imageSelect";
import ImagePicker from "../components/imagePicker";
import Popup1 from "../assets/popup/1.jpg";
import Popup2 from "../assets/popup/2.jpg";
import Popup3 from "../assets/popup/3.jpg";
import Popup4 from "../assets/popup/4.jpg";
import { useStore } from "./container";
import { LegacyCard, FormLayout } from "@shopify/polaris";
import { useEffect, useState } from "react";
import ShopifyAPI from "./../helpers/shopifyApi";
import ColorPickerWithTransparent from "./../components/colorPicker";

const Wrapper = styled.div`
  .item {
    background: rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
  }
  @media (max-width: 1440px) {
    .c-grid {
      grid-template-columns: 1fr;
      .item {
        padding: 2rem;
      }
    }
  }
`;

const PopupTemplate = ({ handleSave }) => {
  const [themeId, setThemeId] = useState("");
  const { state, dispatch } = useStore();
  const { template, image, popup_bg, text_color, button_color } =
    state;

  useEffect(() => {
    handleGetTheme();
  }, []);

  const handleChange = (key, value) => {
    dispatch({ type: "setData", payload: { [key]: value } });
  };

  const handleGetTheme = async () => {
    // await ShopifyAPI.getPublicTheme()
    //   .then((response) => {
    //     if (response.ok) {
    //       setThemeId(response?.payload?.id);
    //     }
    //   })
    //   .catch();
  };

  return (
    <>
      <LegacyCard sectioned title={"Pick a template"}>
        <Wrapper>
          <ImageSelect
            columns={2}
            options={[
              {
                label: "Basic",
                value: "template-1",
                image: Popup1,
              },
              {
                label: "Vertical",
                value: "template-2",
                image: Popup2,
              },
              {
                label: "Horizontal",
                value: "template-3",
                image: Popup3,
              },
              {
                label: "Boxed",
                value: "template-4",
                image: Popup4,
              },
            ]}
            value={template}
            onChange={(v) => handleChange("template", v)}
            hideLabel
          />
        </Wrapper>
      </LegacyCard>
      <LegacyCard sectioned title={"Colors & Image"}>
        <FormLayout>
          <ColorPickerWithTransparent
            label={"Background color"}
            value={popup_bg}
            onChange={(v) => handleChange("popup_bg", v)}
            show_input
          />
          <ColorPickerWithTransparent
            label={"Text color"}
            value={text_color}
            onChange={(v) => handleChange("text_color", v)}
            show_input
          />
          <ColorPickerWithTransparent
            label={"Button color"}
            value={button_color}
            onChange={(v) => handleChange("button_color", v)}
            show_input
          />
          <ImagePicker
            label={"Image"}
            value={image}
            themeId={themeId}
            onChange={(v) => {
              handleChange("image", v?.public_url);
              console.log(v, "image uploaded");
            }}
            onSuccess={(e) => {
              console.log(e, "response?.payload success");
              handleSave({ image: e?.public_url });
            }}
            onRemove={() => {
              handleChange("image", "");
              handleSave({ image: "" });
            }}
          />
        </FormLayout>
      </LegacyCard>
    </>
  );
};

export default PopupTemplate;
