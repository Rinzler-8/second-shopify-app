const PreviewPopup = () => {
  // const {
  //   title,
  //   description,
  //   button,
  //   template,
  //   image,
  //   popup_bg,
  //   text_color,
  //   button_color,
  // } = state;

  const previewRef = document.createElement("div");
  previewRef.style.position = "relative";
  previewRef.style.width = "100%";
  previewRef.style.minHeight = "500px";
  previewRef.style.padding = "80px 50px 150px 50px";
  previewRef.style.display = "flex";
  previewRef.style.alignItems = "center";
  previewRef.style.justifyContent = "center";
  previewRef.style.flexWrap = "wrap";

  const popupOverlay = document.createElement("div");
  popupOverlay.className = "popup-overlay absolute";
  popupOverlay.style.background = "rgba(0, 0, 0, 0.3)";
  popupOverlay.style.top = "0";
  popupOverlay.style.left = "0";
  popupOverlay.style.width = "100%";
  popupOverlay.style.height = "100%";

  const popup = document.createElement("div");
  const template = "template-3";
  // popup.className = `popup ${template}`;
  popup.className = `popup ${template}`;

  const popupInner = document.createElement("div");
  popupInner.className = "popup-inner relative text-center";
  // popupInner.style.backgroundColor = popup_bg;
  popupInner.style.backgroundColor = "#ffffff";
  // popupInner.style.color = text_color;
  popupInner.style.color = "#000";

  const closeButton = document.createElement("button");
  closeButton.className = "close absolute rounded-full";

  // const closeIcon = new Icon({ source: MobileCancelMajor });
  // closeButton.appendChild(closeIcon.node);
  const closeIcon = "X";

  const popupImage = document.createElement("div");
  if (template !== "template-1") {
    popupImage.className = "popup-image";

    const img = document.createElement("img");
    img.src =
      "https://cdn.shopify.com/s/files/1/0792/0664/6076/files/CompressionNavy_244f31dc-e787-4435-88ba-16a222d12473.png?v=1690364896"
        ? "https://cdn.shopify.com/s/files/1/0792/0664/6076/files/CompressionNavy_244f31dc-e787-4435-88ba-16a222d12473.png?v=1690364896"
        : "https://via.placeholder.com/820x400.png?text=Your+image";
    img.alt = "";
    // img.src = image
    //   ? image
    //   : "https://via.placeholder.com/820x400.png?text=Your+image";
    // img.alt = "";

    popupImage.appendChild(img);
  }

  const popupContent = document.createElement("div");
  popupContent.className = "popup-content";

  const titleElement = document.createElement("h3");
  titleElement.className = "text-4xl px-5 font-medium title";
  // titleElement.textContent = title;
  titleElement.textContent = "Don't want to miss anything?";

  const descriptionElement = document.createElement("div");
  descriptionElement.className = "text-2xl mt-4 description";
  // descriptionElement.innerHTML = description;
  descriptionElement.innerHTML =
    "<p>Be the first to see new arrivals, exclusive deals and much more.</p>";

  const buttonElement = document.createElement("button");
  buttonElement.style.backgroundColor = "#000";
  // buttonElement.style.backgroundColor = button_color;
  // buttonElement.style.borderColor = button_color;
  buttonElement.style.borderColor = "#000";
  buttonElement.className =
    "bg-black text-white uppercase font-medium rounded mt-5 text-center pointer-event-none submit";
  // buttonElement.textContent = button;
  buttonElement.textContent = "Subscribed";

  popupContent.appendChild(titleElement);
  popupContent.appendChild(descriptionElement);
  popupContent.appendChild(buttonElement);

  popupInner.appendChild(closeButton);
  popupInner.appendChild(popupImage);
  popupInner.appendChild(popupContent);

  popup.appendChild(popupInner);

  previewRef.appendChild(popupOverlay);
  previewRef.appendChild(popup);

  return previewRef;
};
const popupContainer = document.getElementById("popup-container");
const popupElement = PreviewPopup();
popupContainer.appendChild(popupElement);
