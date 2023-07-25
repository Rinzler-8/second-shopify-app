import React, { useState } from "react";
import { DropZone, Thumbnail, Spinner, Button } from "@shopify/polaris";
import styled from "styled-components";
import { useAuthenticatedFetch } from "./../hooks/useAuthenticatedFetch";
import slugify from "slugify";
import { DeleteMajor } from "@shopify/polaris-icons";
import { showToast } from "./../plugins/toast";
import axios from "axios";

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

  const generateStagedUploads = async (acceptedFiles) => {
    const { name, type } = acceptedFiles;

    const response = await fetch("/api/shopify/generate-uploads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: name,
        mimeType: type,
        resource: "IMAGE",
        httpMethod: "POST",
        // fileSize: size,
      }),
    });

    return response.json();
  };

  const createFileService = async ({ alt, resourceUrl, contentType }) => {
    const response = await fetch("/api/shopify/create-file", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        alt: alt,
        resourceUrl: resourceUrl,
        contentType: contentType,
      }),
    });

    return response.json();
  };
  const getFileByIdService = async ({ fileId }) => {
    const response = await fetch(`/api/shopify/get-file`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: fileId,
      }),
    });

    return response.json();
  };

  const updateFileService = async ({ imageId, altText }) => {
    const response = await fetch("/api/shopify/update-file", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: imageId,
        alt: altText,
      }),
    });

    return response.json();
  };

  const handleUpload = async (file) => {
    const reader = new FileReader();
    reader.onloadend = async (e) => {
      const uploadData = await generateStagedUploads(file);
      const { url, parameters, resourceUrl } = uploadData;
      const formData = new FormData();
      parameters.forEach(({ name, value }) => {
        formData.append(name, value);
      });
      formData.append("file", file);
      setLoading(true);

      await axios
        .post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        .then(async (response) => {
          const fileCreated = await createFileService({
            alt: file.alt,
            resourceUrl,
            contentType: "IMAGE",
          });
          const fileId = fileCreated.id;
          const fileData = await getFileByIdService({ fileId });

          if (response) {
            const imageUrl = fileData?.image?.originalSrc;
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
