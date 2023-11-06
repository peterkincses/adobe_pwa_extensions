import useCategoryProductsOptionsData from "../hooks/useCategoryProductsOptionsData";

const wrapUseCategory = (original) => {
    return function useCategory(props, ...restArgs) {
        const { ...defaultReturnData } = original(
            props,
            ...restArgs
        );
        const { categoryData, pageControl } = defaultReturnData;

        const categoryItemsWithOptions = useCategoryProductsOptionsData({
            categoryData: categoryData ? categoryData : null,
            queries: props.queries,
            pageControl: pageControl,
            sortProps: categoryData && categoryData.sortProps ? categoryData.sortProps : null
        });

        return categoryData && categoryData.products ? {
            ...defaultReturnData,
            categoryData: {
                ...categoryData,
                products: {
                    ...categoryData.products,
                    items: categoryItemsWithOptions.newProductList
                },
            }
        } : defaultReturnData;
    };
};

export default wrapUseCategory;
