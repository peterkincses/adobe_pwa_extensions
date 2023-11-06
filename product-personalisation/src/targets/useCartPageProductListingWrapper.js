import usePersonalisedCartItems from "@bat/product-personalisation/src/hooks/usePersonalisedCartItems";

const wrapUseCartProductListing = (original) => {
    return function useProductListing(props, ...restArgs) {
        const { items, ...defaultReturnData } = original(
            props,
            ...restArgs
        );

        const personalisedCartItemsData = usePersonalisedCartItems({
            items: items
        });
        const {
            personalisedProductList
        } = personalisedCartItemsData;

        return {
            ...defaultReturnData,
            items: personalisedProductList.length ? personalisedProductList : items,
        };
    };
};

export default wrapUseCartProductListing;
