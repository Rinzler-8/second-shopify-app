import styled from "styled-components";

const ImageSelectWrapper = styled.div`
  .item {
    border: 1px solid #ebebeb;
    border-radius: 5px;
    cursor: pointer;
    padding: 2rem 3rem;
    .img {
      flex: 1;
    }
    img {
      display: inline-block;
      pointer-events: none;
    }
    &[data-selected="true"] {
      border-color: var(--p-action-primary);
      box-shadow: 0 0 0 1px var(--p-action-primary);
    }
  }
`;

const ImageSelect = ({
  value,
  onChange,
  options,
  label,
  imgWidth = "100%",
  columns = 2,
  hideLabel = false,
}) => {
  return (
    <ImageSelectWrapper>
      {label && (
        <div className="Polaris-Labelled__LabelWrapper">
          <div className="Polaris-Label">
            <label className="Polaris-Label__Text">{label}</label>
          </div>
        </div>
      )}
      <div className={`c-grid gap-10 c-grid-${columns}-cols`}>
        {options.map((item, index) => {
          return (
            <div
              key={index}
              className="item flex justify-center items-center flex-col text-center"
              data-selected={value === item.value}
              onClick={() => onChange(item.value)}
            >
              <span className="flex-1 flex justify-center items-center">
                <img src={item.image} width={imgWidth} />
              </span>
              {!hideLabel && (
                <span className={"block"} style={{ marginTop: "1rem" }}>
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </ImageSelectWrapper>
  );
};

export default ImageSelect;
