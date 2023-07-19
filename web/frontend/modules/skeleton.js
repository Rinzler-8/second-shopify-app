import React from 'react'
import {SkeletonBodyText, SkeletonDisplayText, SkeletonPage, TextContainer, Layout, Card} from '@shopify/polaris'

export const Skeleton = ({fullWidth}) => (
	<SkeletonPage secondaryActions={2} fullWidth={fullWidth || false}>
		<Layout>
			<Layout.Section>
				<Card sectioned>
					<SkeletonBodyText />
				</Card>
				<Card sectioned>
					<TextContainer>
						<SkeletonDisplayText size="small" />
						<SkeletonBodyText />
					</TextContainer>
				</Card>
				<Card sectioned>
					<TextContainer>
						<SkeletonDisplayText size="small" />
						<SkeletonBodyText />
					</TextContainer>
				</Card>
				<Card sectioned>
					<TextContainer>
						<SkeletonDisplayText size="small" />
						<SkeletonBodyText />
					</TextContainer>
				</Card>
			</Layout.Section>
			<Layout.Section secondary>
				<Card>
					<Card.Section>
						<TextContainer>
							<SkeletonDisplayText size="small" />
							<SkeletonBodyText lines={2} />
						</TextContainer>
					</Card.Section>
					<Card.Section>
						<SkeletonBodyText lines={1} />
					</Card.Section>
				</Card>
				<Card subdued>
					<Card.Section>
						<TextContainer>
							<SkeletonDisplayText size="small" />
							<SkeletonBodyText lines={2} />
						</TextContainer>
					</Card.Section>
					<Card.Section>
						<SkeletonBodyText lines={2} />
					</Card.Section>
					<Card.Section>
						<SkeletonBodyText lines={2} />
					</Card.Section>
				</Card>
			</Layout.Section>
		</Layout>
	</SkeletonPage>
)
export const SkeletonList = ({fullWidth}) => (
  <SkeletonPage primaryAction={true} secondaryActions={2} fullWidth={fullWidth || false}>
	<Layout>
	  <Layout.Section>
		<Card>
		  <Card.Section>
			<TextContainer>
			  <SkeletonBodyText lines={2} />
			</TextContainer>
		  </Card.Section>
		  <Card.Section>
			<TextContainer>
			  <SkeletonBodyText lines={2} />
			</TextContainer>
		  </Card.Section>
		  <Card.Section>
			<TextContainer>
			  <SkeletonBodyText lines={2} />
			</TextContainer>
		  </Card.Section>
		  <Card.Section>
			<TextContainer>
			  <SkeletonBodyText lines={2} />
			</TextContainer>
		  </Card.Section>
		  <Card.Section>
			<TextContainer>
			  <SkeletonBodyText lines={2} />
			</TextContainer>
		  </Card.Section>
		  <Card.Section>
			<TextContainer>
			  <SkeletonBodyText lines={2} />
			</TextContainer>
		  </Card.Section>
		  <Card.Section>
			<TextContainer>
			  <SkeletonBodyText lines={2} />
			</TextContainer>
		  </Card.Section>
		  <Card.Section>
			<TextContainer>
			  <SkeletonBodyText lines={2} />
			</TextContainer>
		  </Card.Section>
		</Card>
	  </Layout.Section>
	</Layout>
  </SkeletonPage>
)
