import { SketchPicker } from "react-color";
import { Popover, TextField } from "@shopify/polaris";
import styled from "styled-components";
import { useState, useCallback } from "react";

const ColorPickerWrapper = styled.div`
  .color-swatch {
    background: #fff;
    border-radius: 2px;
    display: inline-block;
    cursor: pointer;
    width: ${(e) => (e.width ? e.width : "80px")};
    border: 1px solid #ebebeb;
  }
  .color-picker {
    * {
      outline: none;
    }
  }
  .Polaris-Connected {
    width: 250px;
    .color-swatch {
      height: 100%;
    }
  }
`;

const ColorPickerWithTransparent = (props) => {
  const [openPicker, setOpenPicker] = useState(false);
  const toggleOpenPicker = useCallback(
    () => setOpenPicker((openPicker) => !openPicker),
    []
  );

  const activator = props.show_input ? (
    <div onClick={toggleOpenPicker}>
      <TextField
        value={props.value}
        // readOnly
        onChange={(v) => props.onChange(v)}
        connectedRight={
          <div
            className="color-swatch"
            style={{ backgroundColor: props.value }}
          />
        }
      />
    </div>
  ) : (
    <div
      onClick={toggleOpenPicker}
      className="color-swatch Polaris-TextField__Input"
      style={{ backgroundColor: props.value }}
    />
  );

  return (
    <ColorPickerWrapper>
      {props.label && (
        <div className="Polaris-Labelled__LabelWrapper">
          <div className="Polaris-Label">
            <label className="Polaris-Label__Text">{props.label}</label>
          </div>
        </div>
      )}
      <div className="color-picker">
        <Popover
          active={openPicker}
          activator={activator}
          onClose={toggleOpenPicker}
          ariaHaspopup={false}
        >
          <SketchPicker
            {...props}
            color={props.value}
            onChange={(v) => {
              const { r, g, b, a } = v.rgb;
              props.onChange(`rgba(${r}, ${g}, ${b}, ${a})`);
            }}
          />
        </Popover>
      </div>
    </ColorPickerWrapper>
  );
};

export default ColorPickerWithTransparent;
