import React from 'react'
import {ResourceItem, ResourceList, TextStyle, Badge} from "@shopify/polaris"
import styled from 'styled-components'
import EmptyPage from "./emptyPage"
import {navigate} from "@reach/router"
import SearchField from "@modules/searchField"
import Pagination from "@modules/pagination"

const Wrapper = styled.div`
	position: relative;
	.resource-item__wrapper {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.title {
			flex: 1;
			padding-left: 56px;
		}
	}
	.Polaris-ResourceItem__OwnedNoMedia + .Polaris-ResourceItem__Content .title {
		padding-left: 0;
	}
	.column {
		width: 20%;
	}
	.empty {
		padding-top: 100px;
	}
	.Polaris-ResourceItem__Media {
		position: absolute;
    left: 56px;
    top: 50%;
    transform: translateY(-50%);
	}
`

const Header = styled.div`
	padding: 1rem 2rem 1rem calc(2rem + 48px);
	position: absolute;
	top: 1.6rem;
	width: 100%;
	z-index: 11;
	display: flex;
	justify-content: flex-end;
	pointer-events: none;
	span {
    text-align: left;
    font-weight: 500;
    white-space: nowrap;
    border: 0;
	}
`

export default function DataList({items, headers, selectedItems, onSelectionChange, resourceName, pageType, renderItem, promotedBulkActions, bulkActions, selectable, alternateTool, handleSearch, pageInfo, fetchData}) {
	const itemMarkup = (item) => {
		const {_id, title, active} = item
		return (
			<ResourceItem
				id={_id}
				onClick={() => navigate(`/${pageType}/edit/${_id}`)}
				accessibilityLabel={`View details for ${title}`}
				name={title}
			>
				<div className="item-wrapper">
					<div className="column title">
						<h3>
							<TextStyle variation="strong">{title}</TextStyle>
							{!active && <Badge>Deactivate</Badge>}
						</h3>
					</div>
				</div>
			</ResourceItem>
		)
	}
	return (
		<Wrapper>
			<SearchField
				handleSearch={handleSearch}
			/>
			<div className="relative" style={{paddingTop: '1rem'}}>
				{headers && headers.length > 0 && items.length > 0 && !selectedItems.length && (
					<Header>
						{headers.map((item, index) => {
							return (
								<div key={index} style={{width: item.width}}>
									<span>{item.name}</span>
								</div>
							)
						})}
					</Header>
				)}
				<ResourceList
					resourceName={resourceName}
					items={items}
					renderItem={renderItem || itemMarkup}
					selectable={selectable}
					selectedItems={selectedItems || []}
					onSelectionChange={onSelectionChange}
					promotedBulkActions={promotedBulkActions}
					bulkActions={bulkActions}
					alternateTool={alternateTool}
					emptyState={<EmptyPage resourceName={resourceName.plural}/>}
				/>
			</div>
			<Pagination
				fetchData={fetchData}
				pageInfo={pageInfo}
				path={'bundles'}
			/>
		</Wrapper>
	)
}
