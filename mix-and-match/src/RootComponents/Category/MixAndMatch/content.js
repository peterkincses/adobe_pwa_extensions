import React, {Fragment} from 'react';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./mixAndMatch.css";
import MixAndMatchTotals from "./Totals";
import {useMixAndMatchContent} from "@eshopworld/mix-and-match/src/talons/MixAndMatch/useMixAndMatchContent";
import DEFAULT_OPERATIONS from "@eshopworld/mix-and-match/src/RootComponents/Category/MixAndMatch/mixAndMatch.gql";
import PRODUCT_FORM_OPERATIONS from '@magento/peregrine/lib/talons/CartPage/ProductListing/EditModal/productForm.gql';
import MixAndMatchCategorySwitcher from "@eshopworld/mix-and-match/src/RootComponents/Category/MixAndMatch/Switcher";
import MixAndMatchErrors from "./Errors";
import {FormattedMessage} from "react-intl";
import SubCategory from "./subCategory";
import mergeOperations from "@magento/peregrine/lib/util/shallowMerge";
import RichContent from "@magento/venia-ui/lib/components/RichContent";

const MixAndMatchContent = (props) => {
    const {
        categoryId,
        categoryName,
        categoryPath,
        colourAttributes,
        categories,
        categoryDescription
    } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, PRODUCT_FORM_OPERATIONS, props.operations);
    const {
        addMixAndMatchItemToCartMutation,
        updateQuantityMutation,
        removeItemMutation
    } = operations;

    const {
        mixAndMatchState: {
            subCategories,
            totals,
            currency
        },
        handleFilterClick,
        updateCurrentProduct,
        updateCurrentProductSelectedOptions,
        handleAddSetToCart,
        isAddingToCart,
        formErrors,
        isAddToCartClicked,
        setIsAddToCartClicked
    } = useMixAndMatchContent({
        categories,
        categoryId,
        categoryPath,
        colourAttributes,
        addMixAndMatchItemToCartMutation: addMixAndMatchItemToCartMutation,
        updateQuantityMutation: updateQuantityMutation,
        removeItemMutation: removeItemMutation
    });

    const classes = mergeClasses(defaultClasses, props.classes);

    const description = categoryDescription ? (
        <div className={classes.description}>
            <RichContent html={categoryDescription} />
        </div>
    ) : null;

    const subCategoriesSection = subCategories && subCategories.length ?
        subCategories.map((category, index) => {
            return <SubCategory category={category}
                                index={index}
                                handleFilterClick={handleFilterClick}
                                updateCurrentProduct={updateCurrentProduct}
                                updateCurrentProductSelectedOptions={updateCurrentProductSelectedOptions}
                                isAddToCartClicked={isAddToCartClicked}
                                setIsAddToCartClicked={setIsAddToCartClicked}
                                key={'mix-and-match-subcategory-' + index}
            />
        }) : null;

    return (
        <Fragment>
            {description}
            <div className={classes.root}>
                <div className={classes.titleWrap}>
                    <div className={classes.title}>
                        <FormattedMessage id={'mixAndMatch.title'}
                                          defaultMessage={'Mix & Match'}
                        />
                    </div>
                    <MixAndMatchCategorySwitcher />
                </div>
                <MixAndMatchErrors formErrors={formErrors} />
                {subCategoriesSection}
            </div>
            <MixAndMatchTotals totals={totals}
                               handleAddSetToCart={handleAddSetToCart}
                               currency={currency}
                               isAddingToCart={isAddingToCart}
            />
        </Fragment>
    )
}

export default MixAndMatchContent;
