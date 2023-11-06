import {useMemo, useRef} from "react";
import {useQuery} from "@apollo/client";
import { useModuleConfig } from 'useModuleConfig';
import {
    GET_PRODUCT_COLLECTION_SUBSCRIPTION_DATA
} from "@bat/product-subscription/src/components/ProductSubscription/productSubscription.gql";
import {usePagination} from "@magento/peregrine/lib/hooks/usePagination";
import {useSort} from "@magento/peregrine/lib/hooks/useSort";

const useCategoryProductsOptionsData = (props) => {
    const {categoryData, pageControl, queries} = props;
    const categoryId = categoryData && categoryData.category ? categoryData.category.id : null;
    const currentPage = pageControl && pageControl.currentPage ? pageControl.currentPage : 1;
    const categoryProducts = categoryData && categoryData.products && categoryData.products.items ? categoryData.products.items : null;

    const { moduleConfig, loading: moduleConfigLoading, error: moduleConfigError } = useModuleConfig({
        modules: ['subscribepro']
    });

    const { data: pageSizeData } = useQuery(queries.getPageSize, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const pageSize = pageSizeData && pageSizeData.storeConfig.grid_per_page;

    // // @todo: replace personalisation module with subscription when available

    const sortProps = useSort();
    const [currentSort] = sortProps;

    const {
        error: subscriptionItemDataError,
        loading: subscriptionItemDataLoading,
        data: subscriptionItemData
    } = useQuery(GET_PRODUCT_COLLECTION_SUBSCRIPTION_DATA, {
        variables: {
            filters: {["category_id"]: {eq: String(categoryId)}},
            currentPage: Number(currentPage),
            id: Number(categoryId),
            pageSize: Number(pageSize),
            sort: { [currentSort.sortAttribute]: currentSort.sortDirection }
        },
        skip: !moduleConfig || !moduleConfig.enabled || !categoryId || !categoryProducts
    });
    //
    const productCollectionOptionsData = useMemo(() => {
        if (subscriptionItemData && subscriptionItemData.products.items) {
            return subscriptionItemData.products.items;
        }
        return null;
    }, [subscriptionItemData]);

    const newProductList = [];
    if (categoryProducts && moduleConfig && moduleConfig.enabled && productCollectionOptionsData) {
        categoryProducts.map((product, index) => {
            const productOptions = productCollectionOptionsData[index].options;
            const newProduct = {...product, options: productOptions};
            newProductList.push(newProduct);
        });
    }

    return {
        isModuleEnabled: moduleConfig ? moduleConfig.enabled : false,
        isLoading: moduleConfigLoading || subscriptionItemDataLoading,
        error: moduleConfigError || subscriptionItemDataError,
        newProductList: newProductList
    };
};

export default useCategoryProductsOptionsData;
