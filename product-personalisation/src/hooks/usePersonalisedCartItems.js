import { useMemo } from "react";
import {useQuery} from "@apollo/client";
import {useCartContext} from "@magento/peregrine/lib/context/cart";
import { useModuleConfig } from 'useModuleConfig';
import {
    GET_CART_ITEM_PRODUCT_PERSONALISATION_DATA
} from "@bat/product-personalisation/src/components/ProductFullDetail/productPersonalisation.gql";

const usePersonalisedCartItems = (props) => {
    const {items} = props;

    const { moduleConfig, loading: moduleConfigLoading, error: moduleConfigError } = useModuleConfig({
        modules: ['personalisation']
    });

    const [{ cartId }] = useCartContext();

    const { error: psnCartDataError, loading: psnCartDataLoading, data: psnCartData } = useQuery(GET_CART_ITEM_PRODUCT_PERSONALISATION_DATA, {
        variables: {
            cartId
        },
        skip: !cartId || !moduleConfig || !moduleConfig.enabled
    });

    const cartItemPsnDetails = useMemo(() => {
        if (psnCartData && psnCartData.cart.items) {
            return psnCartData.cart.items;
        }
        return null;
    }, [psnCartData]);

    const personalisedProductList = [];
    if (items && moduleConfig && moduleConfig.enabled && cartItemPsnDetails) {
        items.map((product, index) => {
            let personalisation;
            const psnData = cartItemPsnDetails[index] ? cartItemPsnDetails[index].personalisation : null;
            if (psnData && (psnData.front_text || psnData.back_text || psnData.icon || psnData.pattern))
            {
                personalisation = cartItemPsnDetails[index];
            } else {
                personalisation = {personalisation: null}
            }

            const newProduct = {...product, ...personalisation};
            personalisedProductList.push(newProduct);
        });
    }

    return {
        isPsnModuleEnabled: moduleConfig ? moduleConfig.enabled : false,
        psnCartDataError,
        isLoading: moduleConfigLoading || psnCartDataLoading,
        error: moduleConfigError,
        //cartItemPsnDetails,
        personalisedProductList
    };
};

export default usePersonalisedCartItems;
