import React, {useMemo} from 'react';
import {useQuery} from "@apollo/client";
import {cloneDeep} from "lodash";

export const useMixAndMatchSubCategories = props => {
    const {
        categoryId,
        products,
        getMixAndMatchConfigurableOptionsQuery,
        getMixAndMatchVariantsQuery
    } = props;

    const {
        data: configurableOptionsData,
        loading: loadingConfigurableOptionsData
    } = useQuery(getMixAndMatchConfigurableOptionsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            categories: categoryId
        },
        skip: !categoryId
    });

    const configurableOptions = useMemo(() => {
        let configurableData = [];
        if (
            !configurableOptionsData ||
            !configurableOptionsData.categoryList
        ) {
            return null;
        }

        configurableOptionsData.categoryList.map(category => {
            if (category.children && category.children.length) {
                category.children.map(subCat => {
                    if (subCat.products.items.length) {
                        subCat.products.items.map(item => {
                            if (item.configurable_options) {
                                configurableData.push(item);
                            }
                        })
                    }
                })
            }
        });

        return configurableData;
    }, [configurableOptionsData]);

    const {
        data: variantsData,
        loading: loadingVariantsData
    } = useQuery(getMixAndMatchVariantsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            categories: categoryId
        },
        skip: !categoryId
    });

    const variants = useMemo(() => {
        let variantsCollection = [];
        if (
            !variantsData ||
            !variantsData.categoryList
        ) {
            return null;
        }

        variantsData.categoryList.map(category => {
            if (category.children && category.children.length) {
                category.children.map(subCat => {
                    if (subCat.products.items.length) {
                        subCat.products.items.map(item => {
                            if (item.variants) {
                                variantsCollection.push(item);
                            }
                        })
                    }
                })
            }
        });

        return variantsCollection;
    }, [variantsData]);

    const productsWithConfigurableOptions = useMemo(() => {
        if (configurableOptions && variants) {
            products.map(product => {
                const configurableData = configurableOptions.find(c => c.uid === product.uid);
                const variantsData = variants.find(v => v.uid === product.uid);
                product.configurable_options = configurableData.configurable_options;
                product.variants = variantsData.variants;
            })
        }
        return products.filter(product => !(product.__typename === "ConfigurableProduct" && !product.configurable_options));
    }, [products, configurableOptions, variants]);

    return {
        productsWithConfigurableOptions,
        loading: loadingConfigurableOptionsData
    }
}
