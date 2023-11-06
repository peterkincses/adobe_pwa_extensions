import React, { Fragment, createContext, useContext } from 'react';
import { useStoreLocator } from '@eshopworld/store-locator/src/talons/StoreLocator/useStoreLocator';
import DEFAULT_OPERATIONS from './storeLocator.gql';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './storeLocator.css';
import StoreLocatorSearch from './Search';
import StoreLocatorList from './List';
import StoreLocatorMap from './Map';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import Breadcrumbs from './Breadcrumbs';
import { FormattedMessage } from 'react-intl';
import ErrorView from "@magento/venia-ui/lib/components/ErrorView";
import StoreLocatorFilters from "./Filters";
const StoreLocatorContext = createContext();
const { Provider } = StoreLocatorContext;

const StoreLocator = (props) => {
    const {
        getCountryFullNameQuery,
        getStoreLocatorConfigQuery,
        getStoreLocatorLocationsQuery
    } = DEFAULT_OPERATIONS;

    const classes = mergeClasses(defaultClasses, props.classes);

    const {
        countryCode,
        countryFullName,
        handleFilterClick,
        handleToggleView,
        locations,
        loading,
        storeConfig,
        storeLocatorConfig,
        setStoreLocatorState,
        setSelectedLocation,
        storeLocatorState,
        totalCount
    } = useStoreLocator({
        countryFullNameQuery: getCountryFullNameQuery,
        storeLocatorConfigQuery: getStoreLocatorConfigQuery,
        storeLocatorLocationsQuery: getStoreLocatorLocationsQuery
    });

    if (loading) {
        return <LoadingIndicator />;
    }

    if (!storeLocatorConfig) {
        return <ErrorView />;
    }

    const storeLocatorContextValue = {
        countryCode,
        countryFullName,
        handleFilterClick,
        handleToggleView,
        locations,
        loading,
        storeConfig,
        storeLocatorConfig,
        setStoreLocatorState,
        setSelectedLocation,
        storeLocatorState,
        totalCount
    }

    return (
        <Fragment>
            <Breadcrumbs pageType={'landing'} searchQuery={storeLocatorState.searchQuery} />
            <title>
                <FormattedMessage id={'storeLocator.title'}
                                  defaultMessage={'Store Locator'}
                                  />
            </title>
            <div>
                <h1 className={classes.title}>
                    <div className={classes.storeLocatorTitle}>
                        <FormattedMessage
                            id={'storeLocator.title'}
                            defaultMessage={'Store Locator'}
                        />
                    </div>
                </h1>
            </div>
            <Provider value={storeLocatorContextValue}>
                <div className={classes.root}>
                    <div className={classes.listSearch}>
                        <StoreLocatorSearch />
                        <StoreLocatorFilters />
                        <StoreLocatorList />
                    </div>
                    <StoreLocatorMap />
                </div>
            </Provider>
        </Fragment>
    );
};

export default StoreLocator;

export const useStoreLocatorContext = () => useContext(StoreLocatorContext);

