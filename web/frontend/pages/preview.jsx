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
  .teaser {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%) rotate(-90deg);
    transform-origin: 40px bottom;
    display: flex;
    align-items: center;
    border-radius: 0 0 5px 5px;
    background: #fff;
    padding: 0 25px;
    height: 40px;
    background: ${(e) => e.teaser_color};
    color: #fff;
    text-transform: uppercase;
    span {
      font-weight: bold;
      font-size: 15px;
    }
    svg {
      margin-right: 10px;
    }
    &.right {
      right: 0;
      left: auto;
      border-radius: 5px 5px 0 0;
      transform-origin: left 40px;
      transform: translate(100%, 100%) rotate(-90deg);
    }
  }
`;

const PreviewPopup = () => {
  const { state } = useStore();
  const {
    title,
    description,
    button,
    email_placeholder,
    popup_type,
    coupon,
    template,
    image,
    copy_button,
    popup_bg,
    text_color,
    button_color,
    teaser_color,
    teaser_title,
    teaser_position,
    teaser_activate,
  } = state;
  return (
    <Preview teaser_color={teaser_color}>
      <div className={`popup-overlay absolute`} />
      {teaser_activate && (
        <div className={`teaser ${teaser_position}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            fill="none"
          >
            <path
              fill="#fff"
              d="M1.14895 15.09625V8.5719h5.51649v6.89685H1.52005c-.0488 0-.097-.0096-.1421-.0284-.045-.0187-.0859-.0461-.1203-.0807-.0345-.0346-.0618-.0757-.0805-.1209-.0186-.0452-.0282-.0936-.0282-.1425zm7.18563.3725h5.14543c.09841 0 .19279-.0393.26238-.1091.06959-.0699.10869-.1646.10869-.2634V8.5719h-5.5165v6.89685zM.83985 7.76546h5.82559V5.21857H.83985c-.0488 0-.097.00963-.142.02835a.36979.36979 0 00-.1204.08076c-.0345.0346-.0618.07567-.0805.12087a.374677.374677 0 00-.0282.14256v1.80181c0 .04892.0096.09736.0282.14256.0187.0452.046.08627.0805.12087a.369604.369604 0 00.1204.08075c.045.01873.0932.02836.142.02836zm7.49473 0h5.8256a.369813.369813 0 00.142-.02835.371231.371231 0 00.12039-.08076.372698.372698 0 00.08043-.12087.373778.373778 0 00.02825-.14256V5.59111a.374008.374008 0 00-.02824-.14257c-.01865-.0452-.04598-.08627-.08044-.12086a.370914.370914 0 00-.12039-.08076.369626.369626 0 00-.142-.02835H8.33457l.00001 2.54689zM2.17965 1.43727C2.17965-.22865 5.49588.17071 7.5 3.29048c2.00412-3.11977 5.32037-3.51913 5.32037-1.8532 0 1.66455-2.27716 3.05247-5.32037 3.05247-3.04325 0-5.32035-1.38792-5.32035-3.05247v-.00001zm5.63406 2.71001c1.24133-.16531 3.46397-1.18994 3.46397-2.07854 0-.37341-.31988-.55209-.78214-.46154-.67905.133-2.05951 1.46591-2.68183 2.54008zM3.72235 2.06873c0 .88861 2.22261 1.91323 3.46394 2.07854C6.56398 3.0731 5.18355 1.7402 4.50445 1.6072c-.4622-.09056-.7821.08812-.7821.46153z"
            />
          </svg>
          <span>{teaser_title || "Get a discount!"}</span>
        </div>
      )}
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
            {["collect_lead", "subscribe_to_discount"].includes(popup_type) && (
              <div className={"form mt-8"}>
                <input
                  type="email"
                  placeholder={email_placeholder}
                  className="input w-full"
                />
                <button
                  style={{
                    backgroundColor: button_color,
                    borderColor: button_color,
                  }}
                  className={
                    "bg-black text-white rounded mt-5 text-center submit"
                  }
                >
                  {button}
                </button>
              </div>
            )}
            {["give_coupon"].includes(popup_type) && !!coupon && (
              <div className="flex coupon-box" style={{ marginTop: "2rem" }}>
                <div className="coupon px-10 py-4 text-5xl">
                  <span className={"uppercase font-bold"}>{coupon}</span>
                </div>
                <button
                  style={{
                    backgroundColor: button_color,
                    borderColor: button_color,
                  }}
                  className={
                    "bg-black text-white font-medium rounded text-center pointer-event-none submit"
                  }
                >
                  {copy_button}
                </button>
              </div>
            )}
            {popup_type === "announcement" && button && (
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
            )}
          </div>
        </div>
      </div>
    </Preview>
  );
};
export default PreviewPopup;
