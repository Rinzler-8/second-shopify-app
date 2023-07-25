import { DEBOUNCE_TIME } from '@shared/constants';
import { MEDIA_TYPE } from '@shared/constants/media';
import axios from 'axios';
import graphql from './graphql';

const Image = (image) => ({
  width: image.image?.width,
  height: image.image?.height,
  url: image.image?.originalSrc ?? image?.url ?? '',
  alt: image?.alt ?? '',
  id: image?.id,
  createdAt: image?.createdAt,
});

export const getListMediaService = async (variables, mediaType, controller) => {
  try {
    const query = `
    query getFiles($first: Int, $after: String, $query: String, $reverse: Boolean, $sortKey: FileSortKeys) {
      files(
        first: $first
        after: $after
        reverse: $reverse
        query: $query
        sortKey: $sortKey
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            ... on MediaImage {
              alt
              createdAt
              status
              image {
                originalSrc
                height
                width
                altText
              }
              id
            }
            ... on GenericFile {
              id
              originalFileSize
              url
            }
            ... on Video {
              alt
              createdAt
              filename
              id
              status
              duration
              preview {
                image {
                  url
                  height
                  width
                }
              }
              originalSource {
                url
              }
            }
          }
        }
      }
    }
  `;

    const result = await graphql(query, variables, controller);

    const listMediaRaw = result?.data?.files?.edges ?? [];
    const listMediaData = listMediaRaw.map((media) => {
      if (mediaType === MEDIA_TYPE.IMAGE) return Image(media?.node);
      if (mediaType === MEDIA_TYPE.VIDEO) return Video(media?.node);
    });

    return {
      items: listMediaData,
      after: listMediaRaw?.[listMediaRaw.length - 1]?.cursor,
      loadMore: result?.data?.files?.pageInfo?.hasNextPage,
    };
  } catch (error) {
    return {
      items: [],
      after: undefined,
      loadMore: false,
    };
  }
};

export const generateStagedUploadService = async ({ name, type, size, resource }) => {
  const query = `
      mutation generateStagedUploads($input: [StagedUploadInput!]!) {
        stagedUploadsCreate(input: $input) {
          stagedTargets {
            url
            resourceUrl
            parameters {
              name
              value
            }
          }
        }
      }
    `;

  const result = await graphql(query, {
    input: [
      {
        filename: name,
        mimeType: type,
        resource,
        httpMethod: 'POST',
        fileSize: size.toString(),
      },
    ],
  });

  return result?.data?.stagedUploadsCreate?.stagedTargets?.[0];
};

export const uploadFileService = async (url, formData) => {
  await axios.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data;boundary=----foxify----' },
  });
};

export const createFileService = async ({ alt, resourceUrl, contentType }) => {
  const query = `
    mutation fileCreate($files: [FileCreateInput!]!) {
      fileCreate(files: $files) {
        files {
          ... on MediaImage {
            alt
            createdAt
            id
            preview {
              image {
                originalSrc
              }
            }
            status
          }
          ... on Video {
            alt
            createdAt
            filename
            id
            duration
            status
            preview {
              image {
                url
              }
            }
            originalSource {
              url
            }
          }
          ... on GenericFile {
            id
            alt
            createdAt
            fileStatus
            mimeType
            url
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const result = await graphql(query, {
    files: {
      alt,
      originalSource: resourceUrl,
      contentType,
    },
  });
  return result?.data?.fileCreate?.files?.[0];
};

export const getFileByIdService = async (fileId, type) => {
  const query = `
    query getImageById($id: ID!) {
      node(id: $id) {
        ... on MediaImage {
          alt
          createdAt
          status
          image {
            originalSrc
            width
            height
          }
          id
        }
        ... on Video {
          alt
          createdAt
          filename
          id
          status
          duration
          preview {
            image {
              url
            }
          }
          originalSource {
            url
          }
        }
        ... on GenericFile {
          alt
          createdAt
          fileStatus
          id
          url
        }
      }
    }
  `;

  let result;

  const promise = new Promise((resolve) => {
    const interval = setInterval(async () => {
      result = await graphql(query, { id: fileId });

      if (result?.data?.node?.status === 'FAILED') resolve(undefined);
      else if (result?.data?.node?.status === 'READY' || result?.data?.node?.fileStatus === 'READY') {
        clearInterval(interval);

        if (type === 'VIDEO') resolve(Video(result?.data?.node));

        if (type === 'IMAGE') resolve(Image(result?.data?.node));

        resolve(result?.data?.node);
      }
    }, DEBOUNCE_TIME * 4);
  });

  return promise;
};

export const updateFileService = async (imageId, altText) => {
  const query = `
    mutation fileUpdate($input: [FileUpdateInput!]!) {
      fileUpdate(files: $input) {
        files {
          alt
          ... on MediaImage {
            id
            preview {
              image {
                originalSrc
              }
            }
            status
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const result = await graphql(query, {
    input: {
      id: imageId,
      alt: altText,
    },
  });

  return result?.data?.fileCreate?.files?.[0];
};
