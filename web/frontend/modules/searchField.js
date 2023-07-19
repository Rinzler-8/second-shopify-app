import React, {useState, useCallback, useEffect} from 'react'
import {Icon, TextField} from '@shopify/polaris'
import {debounce, updateParam} from '@helpers/utils'
import {SearchMinor} from '@shopify/polaris-icons'
import {getParam} from "@helpers/utils"

const SearchField = ({handleSearch}) => {
	const [queryValue, setQueryValue] = useState('')

	useEffect(() => {
		const query = getParam('query')
		if (query) setQueryValue(query)
	}, [])

	const handleChange = debounce((query) => {
		handleSearch(query)
		updateParam('query', query)
	}, 500)

	const handleFiltersQueryChange = useCallback(
		(value) => {
			setQueryValue(value)
			handleChange(value)
			updateParam('page', '')
		},
		[]
	)
	const handleQueryValueRemove = useCallback(() => {
		setQueryValue('')
		handleSearch('')
		updateParam('query', '')
	}, [])

	return (
		<div className="search">
			<TextField
				value={queryValue}
				placeholder={'Search'}
				prefix={<Icon source={SearchMinor} color="skyDark" />}
				onChange={handleFiltersQueryChange}
				clearButton
				onClearButtonClick={handleQueryValueRemove}
			/>
		</div>
	)
}

export default SearchField
