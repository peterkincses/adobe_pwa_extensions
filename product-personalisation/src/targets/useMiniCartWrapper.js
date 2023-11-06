import usePersonalisedCartItems from "@bat/product-personalisation/src/hooks/usePersonalisedCartItems";

const wrapUseMiniCart = (original) => {
    return function useMiniCart(props, ...restArgs) {
        const { productList, ...defaultReturnData } = original(
            props,
            ...restArgs
        );

        const personalisedCartItemsData = usePersonalisedCartItems({
            items: productList
        });
        const {
            personalisedProductList
        } = personalisedCartItemsData;

        return {
            ...defaultReturnData,
            productList: personalisedProductList.length ? personalisedProductList : productList,
        };
    };
};

export default wrapUseMiniCart;
