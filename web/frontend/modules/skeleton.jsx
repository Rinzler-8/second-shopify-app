import React from "react";
import {
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  VerticalStack,
  Layout,
  AlphaCard,
} from "@shopify/polaris";

export const Skeleton = ({ fullWidth }) => (
  <SkeletonPage secondaryActions={2} fullWidth={fullWidth || false}>
    <Layout>
      <Layout.Section>
        <AlphaCard sectioned>
          <SkeletonBodyText />
        </AlphaCard>
        <AlphaCard sectioned>
          <VerticalStack>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText />
          </VerticalStack>
        </AlphaCard>
        <AlphaCard sectioned>
          <VerticalStack>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText />
          </VerticalStack>
        </AlphaCard>
        <AlphaCard sectioned>
          <VerticalStack>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText />
          </VerticalStack>
        </AlphaCard>
      </Layout.Section>
      <Layout.Section secondary>
        <AlphaCard>
          <AlphaCard.Section>
            <VerticalStack>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={2} />
            </VerticalStack>
          </AlphaCard.Section>
          <AlphaCard.Section>
            <SkeletonBodyText lines={1} />
          </AlphaCard.Section>
        </AlphaCard>
        <AlphaCard subdued>
          <AlphaCard.Section>
            <VerticalStack>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={2} />
            </VerticalStack>
          </AlphaCard.Section>
          <AlphaCard.Section>
            <SkeletonBodyText lines={2} />
          </AlphaCard.Section>
          <AlphaCard.Section>
            <SkeletonBodyText lines={2} />
          </AlphaCard.Section>
        </AlphaCard>
      </Layout.Section>
    </Layout>
  </SkeletonPage>
);
export const SkeletonList = ({ fullWidth }) => (
  <SkeletonPage
    primaryAction={true}
    secondaryActions={2}
    fullWidth={fullWidth || false}
  >
    <Layout>
      <Layout.Section>
        <AlphaCard>
          <AlphaCard.Section>
            <VerticalStack>
              <SkeletonBodyText lines={2} />
            </VerticalStack>
          </AlphaCard.Section>
          <AlphaCard.Section>
            <VerticalStack>
              <SkeletonBodyText lines={2} />
            </VerticalStack>
          </AlphaCard.Section>
          <AlphaCard.Section>
            <VerticalStack>
              <SkeletonBodyText lines={2} />
            </VerticalStack>
          </AlphaCard.Section>
          <AlphaCard.Section>
            <VerticalStack>
              <SkeletonBodyText lines={2} />
            </VerticalStack>
          </AlphaCard.Section>
          <AlphaCard.Section>
            <VerticalStack>
              <SkeletonBodyText lines={2} />
            </VerticalStack>
          </AlphaCard.Section>
          <AlphaCard.Section>
            <VerticalStack>
              <SkeletonBodyText lines={2} />
            </VerticalStack>
          </AlphaCard.Section>
          <AlphaCard.Section>
            <VerticalStack>
              <SkeletonBodyText lines={2} />
            </VerticalStack>
          </AlphaCard.Section>
          <AlphaCard.Section>
            <VerticalStack>
              <SkeletonBodyText lines={2} />
            </VerticalStack>
          </AlphaCard.Section>
        </AlphaCard>
      </Layout.Section>
    </Layout>
  </SkeletonPage>
);
