import { Pagination, TextStyle } from '@shopify/polaris'
import styled from 'styled-components'
import { updateParam } from "@helpers/utils"

const Wrapper = styled.div`
	display: flex;
	padding: 2rem 0;
	align-items: center;
	flex-flow: column;
	justify-content: center;
	.Polaris-Pagination {
		margin-bottom: 10px;
		> span:last-child {
			margin-left: -1px;
		}
	}
`

const CustomPagination = ({ pageInfo, fetchData }) => {
	const { hasNextPage, hasPreviousPage, limit, page, totalDocs } = pageInfo
	const totalPages = Math.ceil(totalDocs / limit)
	
	return (
		totalPages > 1 ? <Wrapper>
			<Pagination
				hasPrevious={hasPreviousPage}
				previousKeys={[37]}
				onPrevious={() => {
					updateParam('page', page - 1)
					fetchData({page: page - 1})
				}}
				hasNext={hasNextPage}
				nextKeys={[39]}
				onNext={() => {
					updateParam('page', page + 1)
					fetchData({page: page + 1})
				}}
			/>
			<div style={{ marginTop: 10 }}>
				<TextStyle variation="subdued">{'Page'} {page}/{totalPages}</TextStyle>
			</div>
		</Wrapper> : ''
	)
}
export default CustomPagination
