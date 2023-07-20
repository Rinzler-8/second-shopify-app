import React from "react";
import {
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  VerticalStack,
  Layout,
  LegacyCard,
} from "@shopify/polaris";

export const Skeleton = ({ fullWidth }) => (
  <SkeletonPage secondaryActions={2} fullWidth={fullWidth || false}>
    <Layout>
      <Layout.Section>
        <LegacyCard sectioned>
          <SkeletonBodyText />
        </LegacyCard>
        <LegacyCard sectioned>
          <VerticalStack>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText />
          </VerticalStack>
        </LegacyCard>
        <LegacyCard sectioned>
          <VerticalStack>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText />
          </VerticalStack>
        </LegacyCard>
        <LegacyCard sectioned>
          <VerticalStack>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText />
          </VerticalStack>
        </LegacyCard>
      </Layout.Section>
      <Layout.Section secondary>
        <LegacyCard>
          <LegacyCard.Section>
            <VerticalStack>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={2} />
            </VerticalStack>
          </LegacyCard.Section>
          <LegacyCard.Section>
            <SkeletonBodyText lines={1} />
          </LegacyCard.Section>
        </LegacyCard>
        <LegacyCard subdued>
          <LegacyCard.Section>
            <VerticalStack>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={2} />
            </VerticalStack>
          </LegacyCard.Section>
          <LegacyCard.Section>
            <SkeletonBodyText lines={2} />
          </LegacyCard.Section>
          <LegacyCard.Section>
            <SkeletonBodyText lines={2} />
          </LegacyCard.Section>
        </LegacyCard>
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
        <LegacyCard>
          <LegacyCard.Section>
            <VerticalStack>
              <SkeletonBodyText lines={2} />
            </VerticalStack>
          </LegacyCard.Section>
          <LegacyCard.Section>
            <VerticalStack>
              <SkeletonBodyText lines={2} />
            </VerticalStack>
          </LegacyCard.Section>
          <LegacyCard.Section>
            <VerticalStack>
              <SkeletonBodyText lines={2} />
            </VerticalStack>
          </LegacyCard.Section>
          <LegacyCard.Section>
            <VerticalStack>
              <SkeletonBodyText lines={2} />
            </VerticalStack>
          </LegacyCard.Section>
          <LegacyCard.Section>
            <VerticalStack>
              <SkeletonBodyText lines={2} />
            </VerticalStack>
          </LegacyCard.Section>
          <LegacyCard.Section>
            <VerticalStack>
              <SkeletonBodyText lines={2} />
            </VerticalStack>
          </LegacyCard.Section>
          <LegacyCard.Section>
            <VerticalStack>
              <SkeletonBodyText lines={2} />
            </VerticalStack>
          </LegacyCard.Section>
          <LegacyCard.Section>
            <VerticalStack>
              <SkeletonBodyText lines={2} />
            </VerticalStack>
          </LegacyCard.Section>
        </LegacyCard>
      </Layout.Section>
    </Layout>
  </SkeletonPage>
);
