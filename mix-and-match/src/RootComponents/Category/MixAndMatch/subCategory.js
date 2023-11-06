import React from 'react';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./mixAndMatch.css";
import MixAndMatchFilters from "./Filters";
import MixAndMatchProducts from "./Products";
import {
    GET_MIX_AND_MATCH_CONFIGURABLE_OPTIONS,
    GET_MIX_AND_MATCH_VARIANTS
} from "@eshopworld/mix-and-match/src/RootComponents/Category/MixAndMatch/mixAndMatch.gql";
import {FormattedMessage} from "react-intl";
import {useMixAndMatchSubCategories} from "@eshopworld/mix-and-match/src/talons/MixAndMatch/useMixAndMatchSubCategories";

const MixAndMatchSubCategories = (props) => {
    const {
        index,
        category,
        handleFilterClick,
        updateCurrentProduct,
        updateCurrentProductSelectedOptions,
        isAddToCartClicked,
        setIsAddToCartClicked
    } = props;

    const {
        productsWithConfigurableOptions,
    } = useMixAndMatchSubCategories({
        categoryId: category.id,
        products: category.items,
        getMixAndMatchConfigurableOptionsQuery: GET_MIX_AND_MATCH_CONFIGURABLE_OPTIONS,
        getMixAndMatchVariantsQuery: GET_MIX_AND_MATCH_VARIANTS
    });

    const classes = mergeClasses(defaultClasses, props.classes);

    if (category.items.length) {
        return (
            <div className={classes.subCategory}>
                <MixAndMatchFilters items={category.items}
                                    filters={category.styleFilters}
                                    appliedFilters={category.appliedFilters}
                                    handleFilterClick={handleFilterClick}
                                    type={'style'}
                                    categoryIndex={index}
                />
                <MixAndMatchProducts items={productsWithConfigurableOptions}
                                     updateCurrentProduct={updateCurrentProduct}
                                     updateCurrentProductSelectedOptions={updateCurrentProductSelectedOptions}
                                     categoryIndex={index}
                                     slideIndex={category.selectedItemIndex}
                                     isAddToCartClicked={isAddToCartClicked}
                                     setIsAddToCartClicked={setIsAddToCartClicked}
                />
                <MixAndMatchFilters items={category.items}
                                    filters={category.colourFilters}
                                    appliedFilters={category.appliedFilters}
                                    handleFilterClick={handleFilterClick}
                                    type={'colour'}
                                    categoryIndex={index}
                />
            </div>
        )
    } else {
        return (
            <p className={classes.noProducts} key={'mixAndMatch-no-collection-message-'+index}>
                <FormattedMessage
                    id={'noProductsFound.noProductsFound'}
                    defaultMessage={'We can\'t find products matching the selection.'}
                /> ({index + 1})
            </p>
        )
    }
}

export default MixAndMatchSubCategories;
