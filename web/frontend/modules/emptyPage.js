import React from 'react'
import {DisplayText, TextContainer, TextStyle} from "@shopify/polaris"
import noResults from '@assets/no-results.svg'
import styled from "styled-components"

const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	flex-flow: column;
	align-items: center;
	padding: 2rem;
	text-align: center;
	img {
		margin-bottom: 20px;
	}
	.Polaris-DisplayText {
		margin-bottom: 2rem;
	}
`

export default function EmptyPage({resourceName}) {
  return (
	<Wrapper className={'empty'}>
	  <img src={noResults} alt="" width={180}/>
	  <TextContainer>
		<DisplayText size="medium">There are no {resourceName.toLowerCase()}.</DisplayText>
		<TextStyle>{'Try changing the filters or search term'}</TextStyle>
	  </TextContainer>
	</Wrapper>
  )
}
