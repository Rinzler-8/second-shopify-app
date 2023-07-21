import styled from "styled-components";
import { Icon } from "@shopify/polaris";
import { MobileCancelMajor } from "@shopify/polaris-icons";
import "../styles/popup.scss";
import { useStore } from "./container";

const Preview = styled.div`
  position: relative;
  width: 100%;
  min-height: 500px;
  padding: 80px 50px 150px 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  .popup-overlay {
    background: rgba(0, 0, 0, 0.3);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const PreviewPopup = () => {
  const { state } = useStore();
  const {
    title,
    description,
    button,
    template,
    image,
    popup_bg,
    text_color,
    button_color,
  } = state;
  return (
    <Preview>
      <div className={`popup-overlay absolute`} />
      <div className={`popup ${template}`}>
        <div
          className={`popup-inner relative text-center`}
          style={{ backgroundColor: popup_bg, color: text_color }}
        >
          <button className="close absolute rounded-full">
            <Icon source={MobileCancelMajor} />
          </button>
          {template !== "template-1" && (
            <div className="popup-image">
              <img
                src={
                  image
                    ? image
                    : "https://via.placeholder.com/820x400.png?text=Your+image"
                }
                alt=""
              />
            </div>
          )}
          <div className="popup-content">
            <h3 className={"text-4xl px-5 font-medium title"}>{title}</h3>
            <div
              className={"text-2xl mt-4 description"}
              dangerouslySetInnerHTML={{ __html: description }}
            />
            <button
              style={{
                backgroundColor: button_color,
                borderColor: button_color,
              }}
              className={
                "bg-black text-white uppercase font-medium rounded mt-5 text-center pointer-event-none submit"
              }
            >
              {button}
            </button>
          </div>
        </div>
      </div>
    </Preview>
  );
};
export default PreviewPopup;
