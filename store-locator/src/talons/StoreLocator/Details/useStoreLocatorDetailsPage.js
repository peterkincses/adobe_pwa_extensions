import React, {useMemo} from 'react';
import {useQuery} from "@apollo/client";
import {FormattedMessage, useIntl} from "react-intl";

export const useStoreLocatorDetailsPage = props => {
    const {
        storeLocatorConfigQuery,
        storeLocatorLocationsQuery,
        locationId
    } = props;

    const { formatMessage } = useIntl();

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

    const {
        data: storeLocatorLocationsData,
        loading: loadingStoreLocatorLocationsData,
        error: storeLocatorLocationsDataError
    } = useQuery(storeLocatorLocationsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !storeLocatorConfig,
        variables: {
            location_id: locationId
        }
    });

    const location = useMemo(() => {
        if (
            !storeLocatorLocationsData ||
            !storeLocatorLocationsData.MpStoreLocatorLocations ||
            !storeLocatorLocationsData.MpStoreLocatorLocations.items
        ) {
            return null;
        }

        return storeLocatorLocationsData.MpStoreLocatorLocations.items[0];

    }, [storeLocatorLocationsData]);

    const formatHours = (hours) => {
        let hour = hours[0];
        const minutes = hours[1];
        const suffix = hour > 12 ?
            formatMessage({
                id:'storeLocatorHours.PM',
                defaultMessage: 'PM'
            })
            :
            formatMessage({
                id:'storeLocatorHours.AM',
                defaultMessage: 'AM'
            })
        ;
        hour = hour > 12 ? hour - 12 : hour;
        return hour + ':' + minutes + ' ' + suffix;
    }

    return {
        formatHours,
        storeConfig,
        storeLocatorConfig,
        location,
        loading: loadingStoreLocatorData || loadingStoreLocatorLocationsData
    }
}
