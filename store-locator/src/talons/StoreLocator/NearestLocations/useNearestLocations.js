import React, {useMemo} from 'react';
import {useQuery} from "@apollo/client";

export const useStoreLocatorNearestLocations = props => {
    const {
        country,
        locationId,
        storeLocatorNearestLocationsQuery
    } = props;

    const {
        data: storeLocatorNearestLocationsData,
        loading: loadingStoreLocatorNearestLocationsData,
        error: storeLocatorNearestLocationsDataError
    } = useQuery(storeLocatorNearestLocationsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !locationId,
        variables: {
            country: country,
            location_id: locationId,
            limit: 3
        }
    });

    const nearestLocations = useMemo(() => {
        if (
            !storeLocatorNearestLocationsData ||
            !storeLocatorNearestLocationsData.MpStoreLocatorLocations ||
            !storeLocatorNearestLocationsData.MpStoreLocatorLocations.items ||
            !storeLocatorNearestLocationsData.MpStoreLocatorLocations.items[0].nearestStoresLocations
        ) {
            return null;
        }

        return storeLocatorNearestLocationsData.MpStoreLocatorLocations.items[0].nearestStoresLocations;

    }, [storeLocatorNearestLocationsData]);

    return {
        nearestLocations,
        loading: loadingStoreLocatorNearestLocationsData
    }
}
