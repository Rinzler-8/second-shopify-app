import React, { useState, useCallback, useEffect } from "react";
import { Filters, Button } from "@shopify/polaris";
import { debounce } from "@helpers/utils";
import styled from "styled-components";
import { navigate } from "@reach/router";

const FilterWrapper = styled.div`
  .clear {
    margin-top: 0.5rem;
  }
`;

export default function Filter({
  filters = [],
  handleSearch,
  appliedFilters = {},
  handleFiltersRemove,
  handleFiltersClearAll,
  currentFilters,
}) {
  const [queryValue, setQueryValue] = useState("");

  const { keyword } = router.query;

  useEffect(() => {
    // if (urlParams.has('keyword')) {
    // 	setQueryValue(getParam('keyword'))
    // }
  }, []);

  const handleSearchChange = debounce((query) => {
    // if (urlParams.has('page')) updateParam('page', '', null)
    // updateParam('keyword', query, '')
    handleSearch();
  }, 500);

  const handleFiltersQueryChange = useCallback((value) => {
    setQueryValue(value);
    handleSearchChange(value);
    // console.log(value, 'search value')
  }, []);
  const handleQueryValueRemove = useCallback(() => {
    setQueryValue("");
    handleSearchChange("");
  }, []);

  const handleClearAll = useCallback(() => {
    setQueryValue("");
    handleFiltersClearAll();
    clearAllParams();
    handleSearch();
  }, []);

  // const currentFilters = []
  if (!currentFilters) {
    currentFilters = [];
    for (const [key, value] of Object.entries(appliedFilters)) {
      if (value === "") continue;
      const obj = {
        key: key,
        label: `${key} is ${value}`,
        onRemove: handleFiltersRemove,
      };
      currentFilters.push(obj);
    }
  }

  let classNames = [];
  if (!filters.length) classNames.push("no-filter");

  return (
    <FilterWrapper className={classNames.join(" ")}>
      <Filters
        queryValue={queryValue}
        filters={filters}
        appliedFilters={currentFilters}
        onQueryChange={handleFiltersQueryChange}
        onQueryClear={handleQueryValueRemove}
        onClearAll={handleClearAll}
        queryPlaceholder={"Search"}
      />
      {currentFilters && currentFilters.length > 1 && (
        <div className="clear">
          <Button size={"slim"} onClick={handleClearAll}>
            Clear all filters
          </Button>
        </div>
      )}
    </FilterWrapper>
  );
}
