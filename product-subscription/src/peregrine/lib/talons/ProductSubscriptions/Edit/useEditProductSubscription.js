import {useEffect, useMemo, useState, useCallback} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {useHistory} from 'react-router-dom';
import {useUserContext } from "@magento/peregrine/lib/context/user";
import {useIntl} from "react-intl";
import {useToasts} from "@magento/peregrine/lib/Toasts";
import {useModuleConfig} from 'useModuleConfig';
import {deriveErrorMessage} from "@magento/peregrine/lib/util/deriveErrorMessage";

export const PRODUCT_SUBSCRIPTION_DISCOUNT_TYPE = 'percentage';//or set value, currently a missing value from moduleConfig

export const useEditProductSubscription = (props = {}) => {
    const {
        getAllSubscriptionProducts,
        getCustomerProductSubscriptionsQuery,
        getStoreConfigQuery,
        updateProductSubscriptionItemsMutation
    } = props;

    const { formatMessage } = useIntl();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [, { addToast }] = useToasts();

    const history = useHistory();
    const [{ isSignedIn }] = useUserContext();

    const { moduleConfig } = useModuleConfig({
        modules: ['subscribepro']
    });

    useEffect(() => {
        if (!isSignedIn || !moduleConfig || !moduleConfig.enabled) {
            history.push('/');
        }
    }, [history, isSignedIn, moduleConfig]);

    const subscriptionOrderNumber = window.location.pathname.split('/').pop();

    const { data: storeConfigData } = useQuery(getStoreConfigQuery,{
        cachePolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !moduleConfig || !moduleConfig.enabled
    });

    const storeConfig = useMemo(() => {
        if (!storeConfigData) {
            return null
        }
        return storeConfigData.storeConfig;
    }, [storeConfigData]);

    const currency = storeConfig && storeConfig.base_currency_code ? storeConfig.base_currency_code : null;

    const {data, loading, error} = useQuery(getAllSubscriptionProducts, {
        cachePolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !moduleConfig || !moduleConfig.enabled
    });

    const allSubscriptionProducts = useMemo(() => {
        if (!data || !data.products || !data.products.items) {
            return null
        }
        // let items;
        // if (data.categoryList[0].products.items) {
        //     items = data.categoryList[0].products.items.filter(item => item.subscription.is_subscription_enabled === true);
        // }

        return data.products.items;

    }, [data]);

    const {
        data: customerSubscriptionsData,
        error: customerSubscriptionsError,
        loading: customerSubscriptionsLoading,
        refetch,
        networkStatus
    } = useQuery(getCustomerProductSubscriptionsQuery,{
        cachePolicy: 'no-cache',
        nextFetchPolicy: 'no-cache',
        variables: {
            isCompact: true
        },
        skip: !moduleConfig || !moduleConfig.enabled,
        notifyOnNetworkStatusChange: true
    });

    const subscriptions = useMemo(() => {
        if (!customerSubscriptionsData) {
            return null
        }

        return customerSubscriptionsData.customer.subscriptions;

    }, [customerSubscriptionsData]);
    const subscription = subscriptions ? subscriptions.filter(subscription => (subscription.original_order_number === subscriptionOrderNumber))[0] : null;

    const [subscriptionState, setSubscriptionState] = useState(subscription);
    const [showUpdateButton, setShowUpdateButton] = useState(false);

    useEffect(() => {
        setSubscriptionState(subscription);
    }, [subscription]);

    const tierDataInformation = useMemo(() => {
        if (!moduleConfig && !moduleConfig.enabled) {
            return null
        }

        return moduleConfig.configuration.tiers;

    }, [moduleConfig]);

    const [
        updateProductSubscriptionItems,
        {
            error: updateProductSubscriptionItemsError,
            loading: updateProductSubscriptionItemsLoading
        }
    ] = useMutation(updateProductSubscriptionItemsMutation);

    const handleDeleteSubscriptionItem = useCallback((subscriptionId) =>
        async () => {
            setIsSubmitting(true);

            const variables = {
                original_order_number: subscription.original_order_number,
                items: [{
                    subscription_id: subscriptionId,
                    removed: true
                }]
            }
            try {
                const updateProductSubscriptionItemsResponse = await updateProductSubscriptionItems({
                    variables
                });
                console.log(updateProductSubscriptionItemsResponse);
                if (updateProductSubscriptionItemsResponse) {
                    // setSubscriptionState(prevState => ({
                    //     ...prevState,
                    //     tier: updateProductSubscriptionItemsResponse.data.subsUpdateItems.tier,
                    //     items: updateProductSubscriptionItemsResponse.data.subsUpdateItems.items
                    // }));
                    //await refetch();
                    await refetch().then((response) => {
                        setIsSubmitting(false);
                        addToast({
                            type: 'info',
                            message: formatMessage({
                                id: 'productSubscription.updateSubsItemToast',
                                defaultMessage: 'Thank you. your subscription has been updated.'
                            }),
                            timeout: 5000
                        });
                    });
                }
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
                setIsSubmitting(false);
            }
        },
        [
            updateProductSubscriptionItems,
            refetch
        ]
    );

    const handleUpdateSubscriptionSummaryQuantities = useCallback(
        async formValues => {
            const {subscription_id, quantity} = formValues;
            setIsSubmitting(true);
            let items = subscription_id.map((id, index) => {
                return {
                    subscription_id: id,
                    qty: quantity[index]
                }
            });

            const variables = {
                original_order_number: subscription.original_order_number,
                items: items
            }
            try {
                const updateProductSubscriptionItemsResponse = await updateProductSubscriptionItems({
                    variables
                });
                console.log(updateProductSubscriptionItemsResponse);
                if (updateProductSubscriptionItemsResponse) {
                    // setSubscriptionState(prevState => ({
                    //     ...prevState,
                    //     tier: updateProductSubscriptionItemsResponse.data.subsUpdateItems.tier,
                    //     items: updateProductSubscriptionItemsResponse.data.subsUpdateItems.items
                    // }));
                    // setIsSubmitting(false);
                    // await refetch();
                    //refetch is required otherwise changes are not visible on page reload
                    await refetch().then((response) =>{
                        setIsSubmitting(false);
                        addToast({
                            type: 'info',
                            message: formatMessage({
                                id: 'productSubscription.editSummaryToast',
                                defaultMessage: 'Thank you. Your subscription has been updated.'
                            }),
                            timeout: 5000
                        });
                    });
                }
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
                setIsSubmitting(false);
            }
        },
        [
            updateProductSubscriptionItems,
            subscription,
            refetch
        ]
    );

    const handleAddNewSubscriptionItems = useCallback((data) => {
        setIsSubmitting(true);
        try {
            const variables = {
                original_order_number: data.original_order_number,
                items: data.items
            }
            updateProductSubscriptionItems({
                variables
            }).then((response) => {
                console.log(response);
                // setSubscriptionState(prevState => ({
                //     ...prevState,
                //     tier: response.data.subsUpdateItems.tier,
                //     items: response.data.subsUpdateItems.items
                // }));
                // setIsSubmitting(false);
                // refetch();
                //refetch is required otherwise changes are not visible on page reload
                refetch().then((refetchResponse) => {
                    console.log(refetchResponse);
                    setIsSubmitting(false);
                    addToast({
                        type: 'info',
                        message: formatMessage({
                            id: 'productSubscription.editSummaryToast',
                            defaultMessage: 'Thank you. Your subscription has been updated.'
                        }),
                        timeout: 5000
                    });
                });
            }).catch((error) => {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
                setIsSubmitting(false);
            });
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }
            setIsSubmitting(false);
        }
    }, [data, updateProductSubscriptionItems, refetch]);

    const grandTotal = (currentTier) => {
        let grandTotal = 0;
        let total = 0;
        let totalDiscount = 0;
        const discount = currentTier && currentTier.discount ? currentTier.discount : 0;
        if (subscriptionState && subscriptionState.items) {
            subscriptionState.items.map(item => {
                const value = item.prices.row_total_including_tax.value;
                total = total + (value);
                if (PRODUCT_SUBSCRIPTION_DISCOUNT_TYPE === 'percentage') {
                    grandTotal = total * ((100 - discount) / 100);
                } else {
                    grandTotal = total - totalDiscount;
                }
            })
        }
        setSubscriptionState(prevState => ({
            ...prevState,
            totals: {
                total: total,
                totalDiscount: grandTotal - total,
                grandTotal: grandTotal
            }
        }))
        return grandTotal;
    }

    const [totalQty, setTotalQty] = useState(0);

    const totalSummaryQuantity = () => {
        let totalQuantity = 0;
        if (subscriptionState && subscriptionState.items) {
            subscriptionState.items.map(item => {
                totalQuantity = totalQuantity + item.qty;
            })
        }
        setTotalQty(totalQuantity);
    }

    useEffect(() => {
        totalSummaryQuantity();
    }, [subscriptionState]);

    const handleQuantityChange = useCallback((qty, index) => {
        setSubscriptionState(prevState => ({
            ...prevState,
            items: [
                ...prevState.items.slice(0, index),
                Object.assign({},
                    prevState.items[index],
                    {
                        qty: qty
                    }
                ),
                ...prevState.items.slice(index+1)
            ]
        }));
    },[subscriptionState]);

    const [updateItemQuantityLimitError, setUpdateItemQuantityLimitError] = useState(null);

    const maxLimitErrorMessage = (maxLimit) => {
        return formatMessage({
            id: 'productSubscription.maxLimitErrorMessage',
            defaultMessage: 'The maximum number of products you can save as part of your subscription is '+ maxLimit +'. Please remove some items or reduce the quantity of an existing item.'
        })
    }

    const minLimitErrorMessage = (minLimit) => {
        return formatMessage({
            id: 'productSubscription.minLimitErrorMessage',
            defaultMessage: 'The minimum number of products you can save as part of your subscription is '+ minLimit +'. Please add more items or increase the quantity of an existing item.'
        })
    }

    const hasQuantityChanged = useCallback(() => {
        setUpdateItemQuantityLimitError(null);
        let showButton = false;
        if (totalQty > 0) {
            const maxLimit = moduleConfig.configuration.product_limit_max;
            const minLimit = moduleConfig.configuration.product_limit_min;
            if (maxLimit && totalQty > maxLimit) {
                setUpdateItemQuantityLimitError(maxLimitErrorMessage(maxLimit))
            } else if (minLimit && totalQty < minLimit) {
                setUpdateItemQuantityLimitError(minLimitErrorMessage(minLimit))
            } else if (subscription.items.length === subscriptionState.items.length) {
                subscription.items.map((item, index) => {
                    if (item.qty !== subscriptionState.items[index].qty) {
                        showButton = true;
                    }
                });
            }
            setShowUpdateButton(showButton);
        }
    }, [totalQty]);

    useEffect(() => {
        hasQuantityChanged();
    }, [totalQty]);

    const getTierInfo = () => {
        let currentTier;
        tierDataInformation.map((tierInfo) => {
            if (tierInfo.min_qty <= totalQty
                && tierInfo.max_qty >= totalQty) {
                currentTier = tierInfo;
            }
        });
        const items = subscriptionState.items;

        setSubscriptionState(prevState => ({
            ...prevState,
            tier: currentTier
        }));

        items.map((item, index) => {
            setSubscriptionState(prevState => ({
                ...prevState,
                items: [
                    ...prevState.items.slice(0, index),
                    Object.assign({},
                        prevState.items[index],
                        {
                            prices: {
                                ...prevState.items[index].prices,
                                row_total: {
                                    ...prevState.items[index].prices.row_total,
                                    value: subscription.items[index].prices.row_total_including_tax.value / subscription.items[index].qty
                                },
                                discounts: currentTier ? currentTier.discount : 0
                            }
                        }
                    ),
                    ...prevState.items.slice(index+1)
                ]
            }));
        });
        grandTotal(currentTier);
    }

    useEffect(() => {
        getTierInfo();
    }, [tierDataInformation, totalQty, subscription]);

    const derivedErrorMessage = useMemo(
        () =>
            deriveErrorMessage([
                error,
                customerSubscriptionsError,
                updateProductSubscriptionItemsError
            ]),
        [error, customerSubscriptionsError, updateProductSubscriptionItemsError]
    );

    return {
        errorMessage: derivedErrorMessage || updateItemQuantityLimitError,
        subscription,
        subscriptionState,
        setSubscriptionState,
        allSubscriptionProducts,
        tierDataInformation,
        handleDeleteSubscriptionItem,
        handleUpdateSubscriptionSummaryQuantities,
        handleAddNewSubscriptionItems,
        handleQuantityChange,
        hasQuantityChanged,
        showUpdateButton,
        loading: customerSubscriptionsLoading || loading,
        isSubmitting,
        currency
    };
};
