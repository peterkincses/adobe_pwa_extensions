import React, {useMemo} from 'react';
import defaultClasses from './filters.css';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import LinkButton from "@magento/venia-ui/lib/components/LinkButton";
import {FormattedMessage} from "react-intl";
import {useStoreLocatorContext} from "../storeLocator";

const StoreLocatorFilters = (props) => {
    const {
        handleFilterClick,
        storeLocatorState: {
            filters,
            selectedFilters
        }
    } = useStoreLocatorContext();

    const classes = mergeClasses(defaultClasses, props.classes);

    if (!filters || !filters.length) {
        return null;
    }

    const clearLink = useMemo(() => {
        return selectedFilters.length ?
            <LinkButton onClick={() => handleFilterClick(0)} className={classes.clearFilters}>
                <FormattedMessage id={'storeLocatorFilters.clearAllText'}
                                  defaultMessage={'Clear All'}
                />
            </LinkButton> : null
    }, [selectedFilters.length]);

    return (
        <div className={classes.root}>
            <div className={classes.title}>
                <FormattedMessage id={'storeLocatorFilters.sectionTitle'}
                                  defaultMessage={'Filter by Brand'}
                />
            </div>
            <ul className={classes.filters} data-ya-scope="filters">
                {filters.map((filter, index) => {
                    const isSelected = selectedFilters.includes(filter.id);
                    const filterClass = isSelected ? classes.selectedFilter : classes.filter;
                    return (
                        <li onClick={() => handleFilterClick(filter.id)}
                            key={`store-locator-filter-${index}`}
                            className={filterClass}
                        >
                            {filter.label}
                        </li>
                    )
                })}
            </ul>
            {clearLink}
        </div>
    )
}

export default StoreLocatorFilters;
