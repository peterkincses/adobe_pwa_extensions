import {useQuery} from "@apollo/client";
import {useMemo, useState, useEffect} from "react";

export const useProductSubscriptionsList = (props) => {
    const {
        getCustomerProductSubscriptionsQuery
    } = props;

    const {
        data,
        error,
        loading,
        refetch: refetchSubscriptionList,
        networkStatus
    } = useQuery(getCustomerProductSubscriptionsQuery,{
        cachePolicy: 'network-only',//cache-and-network caches results and causes bugs after updating data via the storefront
        nextFetchPolicy: 'network-only',
        variables: {
            isCompact: false
        }
    });

    const subscriptions = useMemo(() => {
        if (!data) {
            return null
        }

        return data.customer.subscriptions;

    }, [data]);

    const [subscriptionListState, setSubscriptionListState] = useState(subscriptions);
    //
    // useEffect(() => {
    //     setSubscriptionListState(subscriptions);
    // }, [subscriptions]);

    return {
        subscriptions,
        setSubscriptionListState,
        error,
        loading,
        refetchSubscriptionList
    };
};
