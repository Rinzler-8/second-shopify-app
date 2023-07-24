import React, { useState } from "react";
import { DropZone, Thumbnail, Spinner, Button } from "@shopify/polaris";
import styled from "styled-components";
import { useAuthenticatedFetch } from "./../hooks/useAuthenticatedFetch";
import slugify from "slugify";
import { DeleteMajor } from "@shopify/polaris-icons";
import { showToast } from "./../plugins/toast";

const Picker = styled.div`
  .picker-wrapper {
    display: flex;
  }
  .Polaris-Thumbnail {
    width: 100%;
  }
  .uploaded-file {
    width: 230px;
    position: relative;
    margin-right: 1.5rem;
    .Polaris-Button {
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
  .loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1;
  }
`;

const ImagePicker = ({
  value,
  onChange,
  label = null,
  themeId,
  onSuccess,
  onRemove,
}) => {
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const fetch = useAuthenticatedFetch();
  let url = `/api/shopify/theme/asset`;

  const handleUpload = async (file) => {
    const reader = new FileReader();
    reader.onloadend = async (e) => {
      const fileData = e.target.result.split(";base64,")[1];
      const formData = new FormData();
      formData.append("key", `assets/${slugify(file.name)}`);
      formData.append("attachment", file);

      if (fileData.length > 7000000) {
        return showToast({
          message: "File size too large, please upload file less than 5mb",
          error: true,
        });
      }
      setLoading(true);
      await fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            console.log("response ", response);
            const imageUrl = response?.payload?.asset?.public_url;
            if (imageUrl) {
              onChange(imageUrl);
              if (typeof onSuccess === "function") onSuccess(imageUrl);
            }
          }
        })
        .catch((error) => console.log(error))
        .finally(() => {
          setLoading(false);
          setFile(null);
        });
    };
    reader.readAsDataURL(file);
  };

  const handleDropZoneDrop = (_dropFiles, acceptedFiles, _rejectedFiles) => {
    handleUpload(acceptedFiles[0]);
    setFile((file) => acceptedFiles[0]);
  };

  const uploadedFile = value && !loading && (
    <Thumbnail size="large" source={value} />
  );
  const tempFile = file && loading && (
    <Thumbnail size="large" source={window.URL.createObjectURL(file)} />
  );

  return (
    <Picker>
      {label && (
        <div className="Polaris-Labelled__LabelWrapper">
          <div className="Polaris-Label">
            <label className="Polaris-Label__Text">{label}</label>
          </div>
        </div>
      )}
      <div className="picker-wrapper">
        {(value || tempFile) && (
          <div className="uploaded-file">
            {loading && (
              <div className="loading flex justify-center items-center">
                <Spinner />
              </div>
            )}
            {uploadedFile}
            {tempFile}
            <Button icon={DeleteMajor} onClick={onRemove} />
          </div>
        )}
        <div style={{ width: 120, height: 120 }}>
          <DropZone
            accept="image/*"
            type="image"
            allowMultiple={false}
            onDrop={handleDropZoneDrop}
          >
            <DropZone.FileUpload />
          </DropZone>
        </div>
      </div>
    </Picker>
  );
};
export default ImagePicker;
