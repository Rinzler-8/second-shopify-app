const PreviewPopup = () => {
  const {
    title,
    description,
    button,
    button_url,
    template,
    image,
    popup_bg,
    text_color,
    button_color,
  } = window.Sabbath.Settings;

  const previewRef = document.createElement("div");
  previewRef.className = "previewRef";

  const popup = document.createElement("div");
  popup.className = `popup ${template}`;
  popup.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  const popupInner = document.createElement("div");
  popupInner.className = "popup-inner relative text-center";
  popupInner.style.backgroundColor = popup_bg;
  popupInner.style.color = text_color;

  const closeButton = document.createElement("button");
  closeButton.className = "close absolute rounded-full";
  closeButton.textContent = "X";
  closeButton.addEventListener("click", () => {
    popupContainer.remove();
  });

  const popupImage = document.createElement("div");
  if (template !== "template-1") {
    popupImage.className = "popup-image";

    const img = document.createElement("img");
    img.src = image
      ? image
      : "https://via.placeholder.com/820x400.png?text=Your+image";
    img.alt = "";

    popupImage.appendChild(img);
  }

  const popupContent = document.createElement("div");
  popupContent.className = "popup-content";

  const titleElement = document.createElement("h3");
  titleElement.className = "text-4xl px-5 font-medium title";
  titleElement.textContent = title;

  const descriptionElement = document.createElement("div");
  descriptionElement.className = "text-2xl mt-4";
  descriptionElement.innerHTML = description;

  const buttonElement = document.createElement("button");
  buttonElement.style.backgroundColor = button_color;
  buttonElement.style.borderColor = button_color;
  buttonElement.className =
    "popup-button bg-black text-white uppercase font-medium rounded mt-5 text-center submit";
  buttonElement.textContent = button;
  buttonElement.addEventListener("click", () => {
    window.location.href = button_url;
  });

  popupContent.appendChild(titleElement);
  popupContent.appendChild(descriptionElement);
  popupContent.appendChild(buttonElement);

  popupInner.appendChild(closeButton);
  popupInner.appendChild(popupImage);
  popupInner.appendChild(popupContent);

  popup.appendChild(popupInner);

  previewRef.appendChild(popup);

  return previewRef;
};
const popupContainer = document.getElementById("popup-container");
popupContainer.addEventListener("click", () => {
  popupContainer.remove();
});
const popupElement = PreviewPopup();
popupContainer.appendChild(popupElement);
