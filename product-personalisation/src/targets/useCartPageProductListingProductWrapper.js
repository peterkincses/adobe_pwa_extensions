import usePersonalisedCartItems from "@bat/product-personalisation/src/hooks/usePersonalisedCartItems";

const wrapUseCartPageProductListingProduct = (original) => {
    return function useCartPageProductListingProduct(props, ...restArgs) {
        const {item} = props;

        const { isEditable, ...defaultReturnData } = original(
            props,
            ...restArgs
        );

        const psnData = item.personalisation;

        return {
            ...defaultReturnData,
            isEditable: !psnData ? isEditable : false
        };
    };
};

export default wrapUseCartPageProductListingProduct;
