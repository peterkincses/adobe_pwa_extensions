import { useQuery } from '@apollo/client';
import {useMemo} from "react";
import { useModuleConfig } from 'useModuleConfig';
import {
    GET_PRODUCT_PERSONALISATION_DETAILS
} from "@bat/product-personalisation/src/components/ProductFullDetail/productPersonalisation.gql";

export const useProductPersonalisationToggle = props => {
    const { urlKey } = props;

    const { moduleConfig } = useModuleConfig({
        modules: ['personalisation']
    });

    const {
        data: psnProductDetailsData,
        loading: psnProductDetailsLoading,
        error: psnProductDetailsError
    } = useQuery(GET_PRODUCT_PERSONALISATION_DETAILS, {
        variables: {
            urlKey: urlKey
        }
    });

    const psnProductDetails = useMemo(() => {
        if (!psnProductDetailsData) {
            return null
        }
        const { products } = psnProductDetailsData;

        if (!products) {
            return null
        }

        return products.items[0];

    }, [psnProductDetailsData]);

    return {
        isPsnEnabled: moduleConfig ? moduleConfig.enabled : false,
        psnProductDetails,
        psnProductDetailsError,
        psnProductDetailsLoading
    };
};
