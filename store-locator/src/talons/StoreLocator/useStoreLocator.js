import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useQueryHandler } from '@eshopworld/store-locator/src/talons/StoreLocator/Search/useQueryHandler';
import { isLatLongQuery, sortByDistance, getPositionFromQuery } from "@eshopworld/store-locator/src/components/StoreLocator/utils";

export const useStoreLocator = props => {
    const {
        storeLocatorConfigQuery,
        storeLocatorLocationsQuery,
        countryFullNameQuery,
        locationId
    } = props;

    const { getSanitizedQueryFromUrl } = useQueryHandler();
    const queryText = getSanitizedQueryFromUrl();

    const initialState = {
        filters: [],
        selectedFilters: [],
        selectedLocation: null,
        view: 'map',
        currentSearchLocation: queryText ? getPositionFromQuery(queryText) : null,
        searchQuery: queryText
    }

    const [storeLocatorState, setStoreLocatorState] = useState(initialState);

    const {
        data: storeLocatorData,
        loading: loadingStoreLocatorData,
        error: storeLocatorDataError
    } = useQuery(storeLocatorConfigQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const storeLocatorConfig = useMemo(() => {
        if (
            !storeLocatorData ||
            !storeLocatorData.MpStoreLocatorConfig
        ) {
            return null;
        }

        return storeLocatorData.MpStoreLocatorConfig;

    }, [storeLocatorData]);

    const storeConfig = useMemo(() => {
        if (
            !storeLocatorData ||
            !storeLocatorData.storeConfig
        ) {
            return null;
        }

        return storeLocatorData.storeConfig;

    }, [storeLocatorData]);

    const countryCode = useMemo(() => {
        return storeConfig && storeConfig.general_country_default ? storeConfig.general_country_default : 'US';
    }, [storeConfig]);

    const {
        data: countryFullNameData
    } = useQuery(countryFullNameQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !countryCode,
        variables: {
            countryCode: countryCode
        }
    });

    const countryFullName = useMemo(() => {
        if (
            !countryFullNameData ||
            !countryFullNameData.country ||
            !countryFullNameData.country.full_name_english
        ) {
            return null;
        }

        return countryFullNameData.country.full_name_english

    }, [countryFullNameData]);

    const {
        data: storeLocatorLocationsData,
        loading: loadingStoreLocatorLocationsData,
        error: storeLocatorLocationsDataError,
    } = useQuery(storeLocatorLocationsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !storeLocatorConfig || !countryCode,
        variables: {
            location_id: locationId,
            country: countryCode,//filter out locations set to All Stores store scope by mistake
            search_term: isLatLongQuery(storeLocatorState.searchQuery) ? '' : storeLocatorState.searchQuery
        }
    });

    const locations = useMemo(() => {
        let items = null;
        if (
            storeLocatorLocationsData &&
            storeLocatorLocationsData.MpStoreLocatorLocations &&
            storeLocatorLocationsData.MpStoreLocatorLocations.items
        ) {
            items = storeLocatorLocationsData.MpStoreLocatorLocations.items;
            if (storeLocatorState && storeLocatorState.selectedFilters.length) {
                items = items.filter(item => {
                    return item.brand.filter(brand => storeLocatorState.selectedFilters.includes(brand.id)).length;
                });
            }

            if(storeLocatorState.currentSearchLocation){
                items = sortByDistance(storeLocatorState.currentSearchLocation, items)
            }
        }

        return items;

    }, [storeLocatorLocationsData, storeLocatorState.selectedFilters.length, storeLocatorState.currentSearchLocation]);

    const totalCount = useMemo(() => {
        if (locations) {
            return locations.length;
        }
        if (
            !storeLocatorLocationsData ||
            !storeLocatorLocationsData.MpStoreLocatorLocations ||
            !storeLocatorLocationsData.MpStoreLocatorLocations.total_count
        ) {
            return 0;
        }

        return storeLocatorLocationsData.MpStoreLocatorLocations.total_count;

    }, [storeLocatorLocationsData, locations]);

    const handleToggleView = useCallback((value) => {
        setStoreLocatorState(prevState => ({
            ...prevState,
            view: value
        }));
    }, []);

    const handleFilterClick = (value) => {
        let selectedFilters = storeLocatorState.selectedFilters;
        if (value) {
            if (selectedFilters.includes(value)) {
                selectedFilters = selectedFilters.filter(f => {
                    return f !== value
                });
            } else {
                selectedFilters.push(value);
            }
        } else {
            selectedFilters = [] //only the "Clear all" link has no value
        }
        setStoreLocatorState(prevState => ({
            ...prevState,
            selectedFilters: selectedFilters,
            selectedLocation: null
        }));
    }

    const setSelectedLocation = (location) => {
        setStoreLocatorState(prevState => ({
            ...prevState,
            selectedLocation: location
        }));
    }

    useEffect(() => {
        if (locations) {
            let filters = [];
            locations.map(location => {
                if (location.brand) {
                    location.brand.map(brand => {
                        if(!filters.includes(brand)){
                            filters.push(brand);
                        }
                    })
                }
            });
            setStoreLocatorState(prevState => ({
                ...prevState,
                filters: filters,
                selectedFilters: []
            }));
        }
    }, [storeLocatorLocationsData, loadingStoreLocatorLocationsData]);

    useEffect(() => {
        setStoreLocatorState(prevState => ({
            ...prevState,
            currentSearchLocation: queryText ? getPositionFromQuery(queryText) : null,
            searchQuery: queryText
        }));
    }, [queryText]);

    return {
        countryCode,
        countryFullName,
        handleFilterClick,
        handleToggleView,
        loading: loadingStoreLocatorData || loadingStoreLocatorLocationsData,
        locations,
        setSelectedLocation,
        setStoreLocatorState,
        storeConfig,
        storeLocatorConfig,
        storeLocatorState,
        totalCount
    }
}
