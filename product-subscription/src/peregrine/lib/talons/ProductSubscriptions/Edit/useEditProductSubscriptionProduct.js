import {useCallback, useEffect, useMemo, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { useUserContext } from "@magento/peregrine/lib/context/user";
import {isProductConfigurable} from "@magento/peregrine/lib/util/isProductConfigurable";
import {findMatchingVariant} from "@magento/peregrine/lib/util/findMatchingProductVariant";
import {appendOptionsToPayload} from "@magento/peregrine/lib/util/appendOptionsToPayload";
import {deriveErrorMessage} from "@magento/peregrine/lib/util/deriveErrorMessage";

const deriveOptionCodesFromProduct = product => {
    // If this is a simple product it has no option codes.
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_CODES;
    }

    // Initialize optionCodes based on the options of the product.
    const initialOptionCodes = new Map();
    for (const {
        attribute_id,
        attribute_code
    } of product.configurable_options) {
        initialOptionCodes.set(attribute_id, attribute_code);
    }

    return initialOptionCodes;
};

// Similar to deriving the initial codes for each option.
const deriveOptionSelectionsFromProduct = product => {
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_SELECTIONS;
    }

    const initialOptionSelections = new Map();
    for (const { attribute_id } of product.configurable_options) {
        initialOptionSelections.set(attribute_id, undefined);
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
    const numProductOptions = configurable_options.length;
    const numProductSelections = Array.from(optionSelections.values()).filter(
        value => !!value
    ).length;

    return numProductSelections < numProductOptions;
};

const getMediaGalleryEntries = (product, optionCodes, optionSelections) => {
    let value = [];

    const { media_gallery_entries, variants } = product;
    const isConfigurable = isProductConfigurable(product);

    // Selections are initialized to "code => undefined". Once we select a value, like color, the selections change. This filters out unselected options.
    const optionsSelected =
        Array.from(optionSelections.values()).filter(value => !!value).length >
        0;

    if (!isConfigurable || !optionsSelected) {
        value = media_gallery_entries;
    } else {
        // If any of the possible variants matches the selection add that
        // variant's image to the media gallery. NOTE: This _can_, and does,
        // include variants such as size. If Magento is configured to display
        // an image for a size attribute, it will render that image.
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        value = item
            ? [...item.product.media_gallery_entries, ...media_gallery_entries]
            : media_gallery_entries;
    }

    return value;
};

const SUPPORTED_PRODUCT_TYPES = ['SimpleProduct', 'ConfigurableProduct'];

export const useEditProductSubscriptionProduct = (props = {}) => {
    const {
        handleAddToSubscriptionMutation,
        product,
        handleAddNewSubscriptionItems,
        subscriptionState
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
    const mediaGalleryEntries = useMemo(
        () => getMediaGalleryEntries(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
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

    const subscriptionItemsSkus = () => {
        let skus = [];
        if (subscriptionState.items) {
            subscriptionState.items.map(item => {
                skus.push(item.product.sku);
            })
        }
        return skus;
    }

    const [outOfStockError, setOutOfStockError] = useState(null);

    const [
        addProductSubscriptionItems,
        {
            error: addToSubscriptionError,
            loading: addToSubscriptionLoading
        }
    ] = useMutation(handleAddToSubscriptionMutation);

    const handleAddToSubscription = useCallback(
        async formValues => {
            setOutOfStockError(null);
            const { quantity } = formValues;
            const payload = {
                item: product,
                productType,
                quantity
            };

            if (isProductConfigurable(product)) {
                appendOptionsToPayload(payload, optionSelections, optionCodes);
            }

            if (payload.item.stock_status === 'OUT_OF_STOCK') {
                setOutOfStockError('This item is out of stock'); //@todo: push to errors and display in form errors
                return;
            }

            if (isSupportedProductType) {
                let items;
                if (subscriptionItemsSkus().includes(payload.item.sku)) {
                    const existingItem = subscriptionState.items.filter(item => (item.product.sku === payload.item.sku ))[0];
                    items = {
                        subscription_id: existingItem.subscription_id,
                        qty: parseInt(quantity + existingItem.qty)
                    }
                } else {
                    items = {
                        sku: payload.item.sku,
                        qty: quantity
                    }
                }
                const variables = {
                     original_order_number: subscriptionState.original_order_number,
                     items: [items]
                }
                handleAddNewSubscriptionItems(variables)
            } else {
                console.error('Unsupported product type. Cannot add to cart.');
            }
        },
        [
            isSupportedProductType,
            optionCodes,
            optionSelections,
            product,
            productType,
            subscriptionState,
            addProductSubscriptionItems
        ]
    );

    const derivedErrorMessage = useMemo(
        () =>
            deriveErrorMessage([
                addToSubscriptionError
            ]),
        [addToSubscriptionError]
    );

    return {
        handleAddToSubscription,
        handleSelectionChange,
        errorMessage: derivedErrorMessage || outOfStockError,
        isAddToSubscriptionDisabled:
            !isSupportedProductType ||
            isMissingOptions //||
            // isAddConfigurableLoading ||
            // isAddSimpleLoading,
    };
};
