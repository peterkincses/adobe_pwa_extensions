import React, {Fragment} from 'react';
import {useMixAndMatch} from "@eshopworld/mix-and-match/src/talons/MixAndMatch/useMixAndMatch";
import {GET_MIX_AND_MATCH_CATEGORIES} from "./mixAndMatch.gql";
import MixAndMatchContent from "./content";
import MixAndMatchShimmer from "./Shimmer";

const MixAndMatchWrapper = (props) => {
    const {
        categoryData,
        isCategoryLoading
    } = props;

    const {
        categoryName,
        categoryPath,
        pageTitle,
        colourAttributes,
        categories,
        loading
    } = useMixAndMatch({
        categoryData,
        getMixAndMatchCategoriesQuery: GET_MIX_AND_MATCH_CATEGORIES
    });

    if (loading || isCategoryLoading) {
        return <MixAndMatchShimmer />
    }

    return <Fragment>
                <title>{pageTitle}</title>
                <MixAndMatchContent
                    categoryId={categoryData.uid}
                    categoryName={categoryName}
                    categoryDescription={categoryData.description}
                    categoryPath={categoryPath}
                    categories={categories}
                    colourAttributes={colourAttributes}
                />
           </Fragment>
}

export default MixAndMatchWrapper;
