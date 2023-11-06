import React, {useMemo} from 'react';
import {useQuery} from "@apollo/client";

export const useHeaderPromotions = (props) => {
    const {
        headerPromotionsQuery
    } = props;

    const {
        data: headerPromotionsData,
        loading: loadingHeaderPromotions,
        error: headerPromotionsDataError
    } = useQuery(headerPromotionsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const headerPromotions = useMemo(() => {
        if (
            !headerPromotionsData ||
            !headerPromotionsData.promotionHeaderPromotions ||
            !headerPromotionsData.promotionHeaderPromotions.items
        ) {
            return null;
        }

        return headerPromotionsData.promotionHeaderPromotions.items;

    }, [headerPromotionsData]);

    return {
        headerPromotions,
        isLoading: loadingHeaderPromotions
    }
}
