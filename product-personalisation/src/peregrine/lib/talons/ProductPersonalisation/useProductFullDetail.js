import { useCallback, useState, useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { appendOptionsToPayload } from '@magento/peregrine/lib/util/appendOptionsToPayload';
import { findMatchingVariant } from '@magento/peregrine/lib/util/findMatchingProductVariant';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import {ADD_PSN_PRODUCT_MUTATION} from '@bat/product-personalisation/src/components/ProductFullDetail/productPersonalisation.gql';
import {useIntl} from "react-intl";
import {useToasts} from "@magento/peregrine";

const INITIAL_OPTION_CODES = new Map();
const INITIAL_OPTION_SELECTIONS = new Map();

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
    let valuePsn = [];

    const { media_gallery_entries, variants } = product;
    const isConfigurable = isProductConfigurable(product);

    // Selections are initialized to "code => undefined". Once we select a value, like color, the selections change. This filters out unselected options.
    const optionsSelected =
        Array.from(optionSelections.values()).filter(value => !!value).length >
        0;

    if (!isConfigurable) {
        value = media_gallery_entries;
        valuePsn = media_gallery_entries;//@todo: check simple product image galleries also
    } else {
        if (!optionsSelected) {
            //We leave it empty so we can display a placeholder image in noPsnImage.js
            const psnImage = [
                {
                    file: '',
                    disabled: false,
                    label: 'Product Personalisation: Base Image',
                    id: 1,
                    position: 1,
                    __typeName: "MediaGalleryEntry"
                }
            ];

            valuePsn = psnImage;
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

            const psnBackImage = item.product.psn_background_image;
            const psnFrontImage = item.product.psn_front_image;
            //structure and data to mimic media gallery entries object structure
            const psnImages = [
                {
                    id: 1,
                    disabled: false,
                    label: 'Product Personalisation: Front Image',
                    file: psnFrontImage ? psnFrontImage.url : '',
                    position: 1,
                    __typeName: "MediaGalleryEntry"
                },
                {
                    id: 2,
                    disabled: false,
                    label: 'Product Personalisation: Back Image',
                    file: psnBackImage ? psnBackImage.url : '',
                    position: 2,
                    __typeName: "MediaGalleryEntry"
                }
            ];

            // value = item && psnImages
            //     ? [...item.product.media_gallery_entries, ...media_gallery_entries]
            //     : media_gallery_entries;

            valuePsn = item && psnImages
                ? [...psnImages]
                : media_gallery_entries;
        }
    }

    return valuePsn;
};

const getConfigPrice = (product, optionCodes, optionSelections) => {
    let value;

    const { variants } = product;
    const isConfigurable = isProductConfigurable(product);

    const optionsSelected =
        Array.from(optionSelections.values()).filter(value => !!value).length >
        0;

    if (!isConfigurable || !optionsSelected) {
        value = product.price.regularPrice.amount;
    } else {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        value = item
            ? item.product.price.regularPrice.amount
            : product.price.regularPrice.amount;
    }

    return value;
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

export const useProductFullDetail = props => {
    const {
        addConfigurableProductToCartMutation,
        addSimpleProductToCartMutation,
        product,
        psnProductDetails,
        togglePsnVisibility
    } = props;

    const productType = product.__typename;

    const { formatMessage } = useIntl();

    const [, { addToast }] = useToasts();

    const isSupportedProductType = SUPPORTED_PRODUCT_TYPES.includes(
        productType
    );

    const [{ cartId }] = useCartContext();

    const [
        addConfigurableProductToCart,
        {
            error: errorAddingConfigurableProduct,
            loading: isAddConfigurableLoading
        }
    ] = useMutation(addConfigurableProductToCartMutation);

    const [
        addSimpleProductToCart,
        { error: errorAddingSimpleProduct, loading: isAddSimpleLoading }
    ] = useMutation(addSimpleProductToCartMutation);

    const [
        addPsnProductToCart,
        { error: errorAddingPsnProduct, loading: isAddPsnLoading }
    ] = useMutation(ADD_PSN_PRODUCT_MUTATION);

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
    // const mediaGalleryEntries = useMemo(
    //     () => getMediaGalleryEntries(product, optionCodes, optionSelections),
    //     [product, optionCodes, optionSelections]
    // );
    const mediaGalleryEntries = useMemo(
        () => getMediaGalleryEntries(psnProductDetails, optionCodes, optionSelections),
        [psnProductDetails, optionCodes, optionSelections]
    );

    const handleAddToCart = (psnState) => useCallback(
        async formValues => {
            const { quantity } = formValues;
            const payload = {
                item: product,
                productType,
                quantity
            };

            if (isProductConfigurable(product)) {
                appendOptionsToPayload(payload, optionSelections, optionCodes);
            }

            if (isSupportedProductType) {
                const variables = {
                    cartId,
                    parentSku: payload.parentSku,
                    product: payload.item,
                    quantity: payload.quantity,
                    sku: payload.item.sku,
                    frontText: psnState.front.type === 'text' && psnState.front.value ? psnState.front.value : null,
                    frontFont: psnState.front.type === 'text' && psnState.front.value ? psnState.front.fontFamily : null,
                    frontOrientation: psnState.front.type === 'text' && psnState.front.value ? psnState.front.alignment : null,
                    backText: psnState.back.value ? psnState.back.value : null,
                    backFont: psnState.back.value ? psnState.back.fontFamily : null,
                    backOrientation: psnState.back.value ? psnState.back.alignment : null,
                    icon: psnState.front.icon,
                    pattern: psnState.front.pattern
                };
                try {
                    const addPsnProductResponse = await addPsnProductToCart({
                        variables
                    });
                    if (addPsnProductResponse) {
                        togglePsnVisibility();
                        addToast({
                            type: 'info',
                            message: formatMessage({
                                id: 'personalisationUseFullProductDetail.addedToCartToast',
                                defaultMessage: product.name +' has been added to your cart.'
                            }),
                            timeout: 5000
                        });
                    }
                } catch {
                    return;
                }
                // Use the proper mutation for the type.
                // if (productType === 'SimpleProduct') {
                //     try {
                //         await addSimpleProductToCart({
                //             variables
                //         });
                //     } catch {
                //         return;
                //     }
                // } else if (productType === 'ConfigurableProduct') {
                //     try {
                //         await addConfigurableProductToCart({
                //             variables
                //         });
                //     } catch {
                //         return;
                //     }
                // }
            } else {
                console.error('Unsupported product type. Cannot add to cart.');
            }
        },
        [
            addConfigurableProductToCart,
            addSimpleProductToCart,
            cartId,
            isSupportedProductType,
            optionCodes,
            optionSelections,
            product,
            productType,
            psnState
        ]
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

    const productPrice = useMemo(
        () => getConfigPrice(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
    );

    // Normalization object for product details we need for rendering.
    const productDetails = {
        description: product.description,
        name: product.name,
        price: productPrice,
        sku: product.sku
    };

    const derivedErrorMessage = useMemo(
        () =>
            deriveErrorMessage([
                errorAddingSimpleProduct,
                errorAddingConfigurableProduct,
                errorAddingPsnProduct
            ]),
        [errorAddingConfigurableProduct, errorAddingSimpleProduct, errorAddingPsnProduct]
    );

    return {
        errorMessage: derivedErrorMessage,
        handleAddToCart,
        handleSelectionChange,
        isAddToCartDisabled:
            !isSupportedProductType ||
            isMissingOptions ||
            isAddConfigurableLoading ||
            isAddSimpleLoading ||
            isAddPsnLoading,
        mediaGalleryEntries,
        productDetails,
        isMissingOptions
    };
};
