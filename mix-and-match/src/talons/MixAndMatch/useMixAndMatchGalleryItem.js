import { useCallback, useState, useMemo, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { appendOptionsToPayload } from '@magento/peregrine/lib/util/appendOptionsToPayload';
import { findMatchingVariant } from '@magento/peregrine/lib/util/findMatchingProductVariant';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';

const INITIAL_OPTION_CODES = new Map();
const INITIAL_OPTION_SELECTIONS = new Map();

const deriveOptionCodesFromProduct = product => {
    // If this is a simple product it has no option codes.
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_CODES;
    }

    // Initialize optionCodes based on the options of the product.
    const initialOptionCodes = new Map();
    if (product.configurable_options) {
        for (const {
            attribute_id,
            attribute_code
        } of product.configurable_options) {
            initialOptionCodes.set(attribute_id, attribute_code);
        }
    }

    return initialOptionCodes;
};

// Similar to deriving the initial codes for each option.
const deriveOptionSelectionsFromProduct = product => {
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_SELECTIONS;
    }

    const initialOptionSelections = new Map();
    if (product.configurable_options) {
        for (const { attribute_id } of product.configurable_options) {
            initialOptionSelections.set(attribute_id, undefined);
        }
    }

    return initialOptionSelections;
};

const getIsMissingOptions = (product, optionSelections) => {
    // Non-configurable products can't be missing options.
    if (!isProductConfigurable(product)) {
        return false;
    }

    // Configurable products are missing options if we have fewer
    // option selections than the product has options.
    const { configurable_options } = product;
    const numProductOptions = configurable_options ? configurable_options.length : 0;
    const numProductSelections = Array.from(optionSelections.values()).filter(
        value => !!value
    ).length;

    return numProductSelections < numProductOptions;
};

const SUPPORTED_PRODUCT_TYPES = ['SimpleProduct', 'ConfigurableProduct'];

/**
 * @param {GraphQLQuery} props.addConfigurableProductToCartMutation - configurable product mutation
 * @param {GraphQLQuery} props.addSimpleProductToCartMutation - configurable product mutation
 * @param {Object} props.product - the product, see RootComponents/Product
 *
 * @returns {{
 *  errorMessage: string|undefined,
 *  handleAddToCart: func,
 *  handleSelectionChange: func,
 *  handleSetQuantity: func,
 *  isAddToCartDisabled: boolean,
 *  mediaGalleryEntries: array,
 *  productDetails: object,
 *  quantity: number
 * }}
 */
export const useMixAndMatchGalleryItem = props => {
    const {
        product,
        updateCurrentProductSelectedOptions,
        categoryIndex
    } = props;

    const productType = product.__typename;

    const isSupportedProductType = SUPPORTED_PRODUCT_TYPES.includes(
        productType
    );

    const derivedOptionSelections = useMemo(
        () => deriveOptionSelectionsFromProduct(product),
        [product]
    );

    const [optionSelections, setOptionSelections] = useState(
        derivedOptionSelections
    );

    const derivedOptionCodes = useMemo(
        () => deriveOptionCodesFromProduct(product),
        [product]
    );
    const [optionCodes] = useState(derivedOptionCodes);

    const isMissingOptions = useMemo(
        () => getIsMissingOptions(product, optionSelections),
        [product, optionSelections]
    );

    const handleSelectionChange = useCallback(
        (optionId, selection) => {
            // We must create a new Map here so that React knows that the value
            // of optionSelections has changed.
            const nextOptionSelections = new Map([...optionSelections]);
            nextOptionSelections.set(optionId, selection);
            setOptionSelections(nextOptionSelections);
        },
        [optionSelections]
    );

    // The map of ids to values (and their uids)
    // For example:
    // { "179" => [{ uid: "abc", value_index: 1 }, { uid: "def", value_index: 2 }]}
    const attributeIdToValuesMap = useMemo(() => {
        const map = new Map();
        // For simple items, this will be an empty map.
        const options = product.configurable_options || [];
        for (const { attribute_id, values, label } of options) {
            map.set(attribute_id, { values, attributeCode: label});
        }
        return map;
    }, [product.configurable_options]);

    // An array of selected option uids + labels. Useful for passing to mutations.
    const selectedOptionsArray = useMemo(() => {
        const selectedOptions = [];

        optionSelections.forEach((value, key) => {
            const mapData = attributeIdToValuesMap.get(key);
            if (!mapData) { return };

            const { values, attributeCode} = mapData;

            if (!values || !attributeCode) { return }

            const selectedValue = values.find(
                item => item.value_index === value
            );

            if (selectedValue) {
                selectedOptions.push({
                    attributeCode: attributeCode,
                    uid: selectedValue.uid,
                    label: selectedValue.label
                });
            }
        });
        return selectedOptions;
    }, [attributeIdToValuesMap, optionSelections]);

    useEffect(() => {
        if (selectedOptionsArray.length) {
            updateCurrentProductSelectedOptions(categoryIndex, selectedOptionsArray)
        }
    }, [selectedOptionsArray]);

    return {
        handleSelectionChange,
        isMissingOptions
    };
};
