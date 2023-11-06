import React, {useCallback, useEffect, useMemo, useState} from 'react';
import getImageUrl from "@eshopworld/adobe-scene7/src/util/getImageUrl";
import {useCartContext} from "@magento/peregrine/lib/context/cart";
import {useMutation} from "@apollo/client";
import {useAppContext} from "@magento/peregrine/lib/context/app";
import {BrowserPersistence} from "@magento/peregrine/lib/util";
import {cloneDeep} from "lodash";

export const useMixAndMatchContent = props => {
    const {
        categoryId,
        categoryPath,
        categories,
        colourAttributes,
        addMixAndMatchItemToCartMutation,
        updateQuantityMutation,
        removeItemMutation
    } = props;

    const [{ cartId }] = useCartContext();
    const [, { toggleDrawer }] = useAppContext();
    const storage = new BrowserPersistence();
    const [userErrors, setUserErrors] = useState(null);
    const [isAddToCartClicked, setIsAddToCartClicked] = useState(false);
    const tempStyleIcon = require('@eshopworld/mix-and-match/src/RootComponents/Category/MixAndMatch/Filters/temp_category_icons/tshirt.png')

    const setSubCategoryStyleFilters = (index) => {
        let styleFilters = [];
        if (categories) {
            const mmSubCategory = categories[index];
            if (mmSubCategory && mmSubCategory.children) {
                mmSubCategory.children.map(child => {
                    //exclude promo product - missing required options)
                    if (
                        child.products.items.length === 1 &&
                        child.products.items[0].__typename === 'FloatingPromo'
                    ) { return }

                    const styleIcon = child.mm_style_icon != null ? child.mm_style_icon : tempStyleIcon
                    styleFilters.push({
                        id: child.uid,
                        icon: styleIcon,
                        name: child.name,
                        type: 'style'
                    })
                })
            }
        }
        return styleFilters;
    }

    const setSubCategoryItems = (index) => {
        const items = [];
        if (categories) {
            const mmSubCategory = categories[index];
            if (mmSubCategory && mmSubCategory.children) {
                mmSubCategory.children.map(styleCategory => {
                    if (styleCategory.products &&
                        styleCategory.products.items &&
                        styleCategory.products.items.length
                    ) {
                       styleCategory.products.items.map((item) => {
                            if (item.__typename === "FloatingPromo") { return }//exclude promo product - missing required options

                            if (!items.find(entry => entry.sku === item.sku)) {
                                const newItem = cloneDeep(item);
                                newItem.categories = [{'uid': styleCategory.uid}];//we had to remove category uid from the graphql call as it's too expensive
                                items.push(newItem);
                            } else {
                                const existingItem = items.find(entry => entry.sku === item.sku);
                                existingItem.categories.push({'uid': styleCategory.uid});//we had to remove category uid from the graphql call as it's too expensive
                            }
                        });
                    }
                });
            }
        }

        return items;
    }

    const getColorName = (color_options, color_name) => {
        if (!color_name || !color_options) {
            return null;
        }
        const currentColorName = color_options.find(
            option => +option.value === +color_name
        );
        if (!currentColorName) {
            return null;
        }
        return currentColorName.label;
    };

    const getColorFilterIcon = (item) => {
        if (item && item.small_image && item.small_image.url && item.small_image.url.includes('scene7')) {
            return getImageUrl(item, 'related', false, 's')
        }
        return item.small_image.url;
    }

    const setSubCategoryColorFilters = (index, items) => {
        let colorFilters = [];
        if (items && items.length) {
            items.map(item => {
                const colorName = item.color_family_name;
                if (colorName) {
                    if (!colorFilters.find(filter => +filter.id === +colorName)) {
                        colorFilters.push({
                            id: colorName,
                            icon: getColorFilterIcon(item),
                            name: getColorName(colourAttributes, colorName),
                            itemSku: item.sku,
                            itemId: item.id,
                            type: 'colour'
                        });
                    }
                }
            });
            if (colorFilters.length) {
                colorFilters.sort((a, b) => a.name.localeCompare(b.name));
            }
        } else {
            if (categories) {
                const mmSubCategory = categories[index];
                if (mmSubCategory && mmSubCategory.children) {
                    mmSubCategory.children.map(styleCategory => {
                        if (styleCategory.products &&
                            styleCategory.products.items &&
                            styleCategory.products.items.length
                        ) {
                            const subCatProducts = styleCategory.products.items.filter(product => product.__typename !== "FloatingPromo");
                            subCatProducts.map(item => {
                                const colorName = item.color_family_name;
                                if (colorName) {
                                    if (!colorFilters.find(filter => +filter.id === +colorName)) {
                                        colorFilters.push({
                                            id: colorName,
                                            icon: getColorFilterIcon(item),
                                            name: getColorName(colourAttributes, colorName),
                                            itemSku: item.sku,
                                            itemId: item.id,
                                            type: 'colour'
                                        });
                                    }
                                }
                                if (colorFilters.length) {
                                    colorFilters.sort((a, b) => a.name.localeCompare(b.name));
                                }
                            });
                        }
                    });
                }
            }
        }
        return colorFilters;
    }

    const initialState = {
        subCategories: [
            {
                id: categories[0].id,
                styleFilters: setSubCategoryStyleFilters(0),
                colourFilters: [],//generated by pre-selecting the first style category
                items: setSubCategoryItems(0),
                selectedItemIndex: 0,
                appliedFilters: []
            },
            {
                id: categories[1].id,
                styleFilters: setSubCategoryStyleFilters(1),
                colourFilters: [],//generated by pre-selecting the first style category
                items: setSubCategoryItems(1),
                selectedItemIndex: 0,
                appliedFilters: []
            }
        ],
        currency: storage.getItem('store_view_currency') || 'USD',
        totals: {}
    }

    const [mixAndMatchState, setMixAndMatchState] = useState(initialState);

    useEffect(() => {
        mixAndMatchState.subCategories.map((sub, index) => {
            if (!sub.appliedFilters.length && sub.styleFilters.length) {
                handleFilterClick(sub.styleFilters[0], index);//pre-select first style category
            } else if (sub.appliedFilters.length && sub.colourFilters.length) {
                if (sub.appliedFilters.filter(f => f.type === 'colour').length === 0) {
                    handleFilterClick(sub.colourFilters[0], index);//pre-select first colour filter
                }
            }
        })
    }, [mixAndMatchState]);

    const item1 = mixAndMatchState.subCategories[0].items[mixAndMatchState.subCategories[0].selectedItemIndex];
    const item2 = mixAndMatchState.subCategories[1].items[mixAndMatchState.subCategories[1].selectedItemIndex];
    const selectedItems = [item1, item2];

    const updateTotals = () => {
        if (selectedItems.length) {
            let itemsData = [];
            let subTotal = 0;
            selectedItems.map((item, key) => {
                if (!item) { return }
                itemsData.push({
                    name: item.name,
                    minimalPrice: item.price.minimalPrice.amount.value,
                    regularPrice: item.price.regularPrice.amount.value
                });
                subTotal = subTotal + item.price.minimalPrice.amount.value;
            });
            setMixAndMatchState(prevState => ({
                ...prevState,
                totals: {
                    items: itemsData,
                    subTotal: subTotal
                }
            }));
        }
    }

    useEffect(() => {
        updateTotals();
    }, [mixAndMatchState.subCategories]);

    const handleFilterClick = (filter, categoryIndex) => {
        let activeItemIndex = 0;
        let subCategoryItems = initialState.subCategories[categoryIndex].items;
        const currentFilters = mixAndMatchState.subCategories[categoryIndex].appliedFilters;
        //can apply only one filter per type - 1 colour/1 style
        let newAppliedFilters = [...currentFilters.filter(cf => cf.type !== filter.type), filter];

        if (filter.type === 'colour') {
            newAppliedFilters.map(f => {
                if (f.type === 'style') {
                    subCategoryItems = subCategoryItems.filter(item => item.categories.find(cat => cat.uid === f.id));
                }
                if (f.type === 'colour') {
                    subCategoryItems = subCategoryItems.filter(item => item.color_family_name === f.id);
                }
            });
        }
        if (filter.type === 'style') {
            subCategoryItems = subCategoryItems.filter(item => item.categories.find(cat => cat.uid === filter.id));
            newAppliedFilters = newAppliedFilters.filter(f => f.type === filter.type);//this removes colour filter
        }

        // const currentProduct = mixAndMatchState.subCategories[categoryIndex].items[mixAndMatchState.subCategories[categoryIndex].selectedItemIndex]
        // const siblings = currentProduct && currentProduct.family_products ? currentProduct.family_products : [];

        //scenario: black t-shirt selected, click on white filter and find the index of the black t-shirts white coloured sibling
        // if (filter.type === 'colour' && siblings.length) {
        //     let siblingSkus = [];
        //     siblings.map(sibling => {
        //         siblingSkus.push(sibling.sku);
        //     });
        //     subCategoryItems.map((item, index) => {
        //         if (siblingSkus.find(sibling => sibling === item.sku)) {
        //             //activeItemIndex = index;
        //         }
        //     });
        // }

        setMixAndMatchState(prevState => {
            return {
                ...prevState,
                subCategories: [
                    ...prevState.subCategories.slice(0, categoryIndex),
                    Object.assign({},
                        prevState.subCategories[categoryIndex],
                        {
                            selectedItemIndex: activeItemIndex,
                            items: subCategoryItems,
                            appliedFilters: newAppliedFilters,
                            colourFilters: filter.type === 'style' ? setSubCategoryColorFilters(categoryIndex, subCategoryItems) : prevState.subCategories[categoryIndex].colourFilters
                        }
                    ),
                    ...prevState.subCategories.slice(categoryIndex + 1)
                ]
            }
        });
    }

    const updateCurrentProduct = (categoryIndex, slide) => {
        setMixAndMatchState(prevState => {
            return {
                ...prevState,
                subCategories: [
                    ...prevState.subCategories.slice(0, categoryIndex),
                    Object.assign({},
                        prevState.subCategories[categoryIndex],
                        {
                            selectedItemIndex: slide
                        }
                    ),
                    ...prevState.subCategories.slice(categoryIndex + 1)
                ]
            }
        });
    }

    const updateCurrentProductSelectedOptions = (categoryIndex, selectedOptions) => {
        setMixAndMatchState(prevState => {
            const itemIndex = prevState.subCategories[categoryIndex].selectedItemIndex;
            return {
                ...prevState,
                subCategories: [
                    ...prevState.subCategories.slice(0, categoryIndex),
                    Object.assign({},
                        prevState.subCategories[categoryIndex],
                        {
                            items: [
                                ...prevState.subCategories[categoryIndex].items.slice(0, itemIndex),
                                Object.assign({},
                                    prevState.subCategories[categoryIndex].items[itemIndex],
                                    {
                                        selected_options: selectedOptions
                                    }
                                ),
                                ...prevState.subCategories[categoryIndex].items.slice(itemIndex + 1)
                            ]
                        }
                    ),
                    ...prevState.subCategories.slice(categoryIndex + 1)
                ]
            }
        });
    }

    const validateItems = () => {
        let missingOptions = false;
        setIsAddToCartClicked(true);
        selectedItems.map(item => {
            if (item.__typename === 'ConfigurableProduct' && !item.selected_options) {
                console.log('no options selected');
                missingOptions = true;
            }
        });

        return !missingOptions;
    }

    const [
        addMixAndMatchItemToCart,
        {
            error: errorAddingMixAndMatchSelectionToCart,
            loading: isaddMixAndMatchItemToCartLoading
        }
    ] = useMutation(addMixAndMatchItemToCartMutation);

    const [
        updateCartItemQuantity,
        {
            error: updateCartItemQuantityError,
            loading: isUpdateCartItemQuantityLoading
        }
    ] = useMutation(updateQuantityMutation);

    const [
        removeItem,
        {
            loading: removeItemLoading,
            called: removeItemCalled,
            error: removeItemError
        }
    ] = useMutation(removeItemMutation);

    const handleRemoveItem = useCallback(
        async items => {
            try {
                const valueUid = item1.selected_options ? item1.selected_options[0].uid : null;
                if (valueUid) {
                    const cartItemToRemove = items.filter(item => {
                        if (item.product.sku === item1.sku) {
                            const cartItemConfigValueId = item.configurable_options ? item.configurable_options[0].configurable_product_option_value_uid : null
                            return cartItemConfigValueId && valueUid && (cartItemConfigValueId === valueUid);
                        }
                        return false;
                    });
                    if (cartItemToRemove) {
                        const item = cartItemToRemove[0];
                        const newQuantity = items.quantity - 1;
                        if (newQuantity > 0) {
                            await updateCartItemQuantity({
                                variables: {
                                    cartId: cartId,
                                    cartItemId: item.uid,
                                    quantity: newQuantity
                                }
                            })
                        } else {
                            await removeItem({
                                variables: {
                                    cartId,
                                    itemId: item.uid
                                }
                            });
                        }
                    }
                }
            } catch (e) {}
        },
        [cartId, removeItem, item1]
    );

    const handleAddSetToCart = useCallback(
        async () => {
            setUserErrors(null);
            try {
                const isValid = await validateItems();
                if (!isValid) { return }

                // add item1
                const addItem1ToCartResponse = await addMixAndMatchItemToCart({
                    variables: {
                        cartId: cartId,
                        cartItem: {
                            quantity: 1,
                            sku: selectedItems[0].sku,
                            selected_options: selectedItems[0].selected_options[0].uid
                        }
                    }
                });

                if (addItem1ToCartResponse &&
                    addItem1ToCartResponse.data &&
                    addItem1ToCartResponse.data.addProductsToCart
                ) {
                    const responseErrors = addItem1ToCartResponse.data.addProductsToCart.user_errors;
                    if (responseErrors.length) {
                        const addToCartErrors = responseErrors.map(
                            error => {
                                if (error && error.message) {
                                    return {
                                        product: selectedItems[0],
                                        message: error.message
                                    };
                                }
                            }
                        );
                        setUserErrors(addToCartErrors);
                    } else {
                        // add item 2
                        const addItem2ToCartResponse = await addMixAndMatchItemToCart({
                            variables: {
                                cartId: cartId,
                                cartItem: {
                                    quantity: 1,
                                    sku: selectedItems[1].sku,
                                    selected_options: selectedItems[1].selected_options[0].uid
                                }
                            }
                        });
                        if (addItem2ToCartResponse &&
                            addItem2ToCartResponse.data &&
                            addItem2ToCartResponse.data.addProductsToCart
                        ) {
                            const responseErrors = addItem2ToCartResponse.data.addProductsToCart.user_errors;
                            //remove item1 if item2 throws an error
                            if (responseErrors && responseErrors.length) {
                                const addToCartErrors = responseErrors.map(
                                    error => {
                                        if (error && error.message) {
                                            return {
                                                product: selectedItems[1],
                                                message: error.message
                                            };
                                        }
                                    }
                                );
                                setUserErrors(addToCartErrors);
                                await handleRemoveItem(addItem2ToCartResponse.data.addProductsToCart.cart.items)
                            } else if (addItem2ToCartResponse.data.addProductsToCart.cart) {
                                //need to trigger refetch as well to update remaining products
                                storage.setItem('mix_and_match_cart_items', selectedItems.map(item => { return item }));
                                toggleDrawer('minicart');
                            }
                        }
                    }
                }
            } catch {
                return;
            }
        }, [mixAndMatchState, cartId, addMixAndMatchItemToCartMutation, selectedItems, setUserErrors]);

    const formErrors = useMemo(() => {
        const newFormErrors = [];
        if (userErrors) {
            userErrors.forEach(userError => {
                newFormErrors.push(userError);
            });
        }

        return newFormErrors;
    }, [
        errorAddingMixAndMatchSelectionToCart,
        updateCartItemQuantityError,
        userErrors
    ]);

    return {
        mixAndMatchState,
        handleFilterClick,
        updateCurrentProduct,
        updateCurrentProductSelectedOptions,
        handleAddSetToCart,
        formErrors,
        isAddingToCart: isaddMixAndMatchItemToCartLoading,
        isAddToCartClicked,
        setIsAddToCartClicked
    }
}
