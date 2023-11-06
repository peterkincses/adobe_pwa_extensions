import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useQuery} from "@apollo/client";
import {
    GET_CUSTOM_ATTRIBUTE_META_DATA
} from "@eshopworld/core/src/talons/RootComponents/Product/customAttributeMeta.gql";
import {cloneDeep} from "lodash";
import {useBreadcrumbs} from "@magento/peregrine/lib/talons/Breadcrumbs/useBreadcrumbs";

const COLOUR_FILTER_ATTRIBUTE = 'color_family_name';

export const useMixAndMatch = props => {
    const {
        categoryData,
        getMixAndMatchCategoriesQuery
    } = props;

    const categoryName = categoryData ? categoryData.name : null;
    const metaTitle = categoryData ? categoryData.meta_title : null;
    const pageTitle = metaTitle || categoryName;

    const {
        currentCategory,
        normalizedData
    } = useBreadcrumbs({ categoryId: categoryData.uid });

    const categoryPath = useMemo(() => {
        let path = [];
        normalizedData ? normalizedData.map(slug => {
            path.push(slug.text);
        }) : null;
        path.push(currentCategory);
        return path;
    }, [normalizedData, currentCategory]);

    let categoryIds = categoryData.mm_related_categories ? categoryData.mm_related_categories.split(',') : null;
    if (categoryIds) {
        categoryIds = categoryIds.map(str => Number(str));
    }

    const { data: colourAttributeData, loading: loadingColourAttributeData } = useQuery(GET_CUSTOM_ATTRIBUTE_META_DATA, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            attributes: [
                {
                    attribute_code: COLOUR_FILTER_ATTRIBUTE,
                    entity_type: 'catalog_product'
                }
            ]
        }
    });

    const colourAttributes = useMemo(() => {
        if (
            !colourAttributeData ||
            !colourAttributeData.customAttributeMetadata ||
            !colourAttributeData.customAttributeMetadata.items
        ) {
            return null;
        }

        const colour_options = colourAttributeData.customAttributeMetadata.items.find(
            item => item.attribute_code === COLOUR_FILTER_ATTRIBUTE
        );

        if (!colour_options) {
            return null;
        }

        return colour_options.attribute_options;
    }, [colourAttributeData]);

    const {
        data: categoriesData,
        loading: loadingCategoriesData
    } = useQuery(getMixAndMatchCategoriesQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            categories: categoryIds
        }
    });

    const categories = useMemo(() => {
        if (
            !categoriesData ||
            !categoriesData.categoryList
        ) {
            return null;
        }

        const list = categoriesData.categoryList;
        const clonedList = cloneDeep(list);
        const filteredList = list.map((category, key) => {
            const filteredCategory = category.children.filter(cat => cat.products.items.length);
            clonedList[key].children = filteredCategory;

            return clonedList[key];
        });

        const sortedList = [...filteredList].sort((a, b) => categoryIds.indexOf(a['id']) - categoryIds.indexOf(b['id']));
        return sortedList;

    }, [categoriesData]);

    return {
        categoryName,
        categoryPath,
        pageTitle,
        colourAttributes,
        categories,
        loading: loadingColourAttributeData || loadingCategoriesData
    }
}
