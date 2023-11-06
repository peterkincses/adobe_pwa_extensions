import {useMutation, useQuery} from "@apollo/client";
import {useCallback, useMemo, useState} from "react";
import {useIntl} from "react-intl";
import {useToasts} from "@magento/peregrine/lib/Toasts";

export const useProductSubscriptionsListItem = (props) => {
    const {
        skipNextSubscriptionDeliveryMutation,
        pauseSubscriptionDeliveryMutation,
        resumeSubscriptionDeliveryMutation,
        cancelSubscriptionDeliveryMutation,
        updateSubsDeliveryAddressMutation,
        updateSubsNextDeliveryDateMutation,
        refetchSubscriptionList
    } = props;

    const { formatMessage } = useIntl();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [, { addToast }] = useToasts();

    const [skipNextDelivery, { error: skipNextDeliveryError }] = useMutation(
        skipNextSubscriptionDeliveryMutation,
        {
            fetchPolicy: 'no-cache'
        }
    );

    const handleSkipNextDelivery = useCallback(
        async (orderNumber, index) => {
            setIsSubmitting(true);
            try {
                const skipDeliveryResponse = await skipNextDelivery({
                    variables: {
                        original_order_number: orderNumber
                    }
                });
                console.log(skipDeliveryResponse);
                if (skipDeliveryResponse) {
                    // const newState = [...subscriptions];
                    // newState[index] = {
                    //     ...newState[index],
                    //     status: skipDeliveryResponse.data.subsSkipNextDelivery.status,
                    //     subscription_dates: skipDeliveryResponse.data.subsSkipNextDelivery.subscription_dates
                    // }
                    // setSubscriptionListState(newState);

                    //refetch is necessary as the data remains the same after page reload without it even with a no-cache fetchPolicy
                    await refetchSubscriptionList().then(() => {
                        const values = skipDeliveryResponse.data.subsSkipNextDelivery;
                        setIsSubmitting(false);
                        addToast({
                            type: 'info',
                            message: formatMessage({
                                id: 'productSubscription.skippedNextDeliveryToast',
                                defaultMessage: 'Thank you! Your next delivery date is now '+ values.subscription_dates.next_order_date
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
        []
    );

    const [pauseProductSubscription, { error: pauseProductSubscriptionError }] = useMutation(
        pauseSubscriptionDeliveryMutation,
        {
            fetchPolicy: 'no-cache'
        }
    );

    const handlePauseProductSubscription = useCallback(
        async (orderNumber, index) => {
            setIsSubmitting(true);
            try {
                const pauseProductSubscriptionResponse = await pauseProductSubscription({
                    variables: {
                        original_order_number: orderNumber
                    }
                });
                setIsSubmitting(false);
                if (pauseProductSubscriptionResponse) {
                    // const newState = [...subscriptions];
                    // newState[index] = {
                    //     ...newState[index],
                    //     status: pauseProductSubscriptionResponse.data.subsPauseSubscription.status,
                    //     subscription_dates: pauseProductSubscriptionResponse.data.subsPauseSubscription.subscription_dates
                    // }
                    // setSubscriptionListState(newState);

                    //refetch is necessary as the data remains the same after page reload without it even with a no-cache fetchPolicy
                    await refetchSubscriptionList().then((response) => {
                        console.log(response);
                        setIsSubmitting(false);
                        addToast({
                            type: 'info',
                            message: formatMessage({
                                id: 'productSubscription.pauseProductSubscriptionToast',
                                defaultMessage: 'Thank you. Your subscription is now paused.'
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
        []
    );

    const [resumeProductSubscription, { error: resumeProductSubscriptionError }] = useMutation(
        resumeSubscriptionDeliveryMutation,
        {
            fetchPolicy: 'no-cache'
        }
    );

    const handleResumeProductSubscription = useCallback(
        async (orderNumber, index) => {
            setIsSubmitting(true);
            try {
                const resumeProductSubscriptionResponse = await resumeProductSubscription({
                    variables: {
                        original_order_number: orderNumber
                    }
                });
                console.log(resumeProductSubscriptionResponse);
                if (resumeProductSubscriptionResponse) {
                    // const newState = [...subscriptions];
                    // newState[index] = {
                    //     ...newState[index],
                    //     status: resumeProductSubscriptionResponse.data.subsResumeSubscription.status,
                    //     subscription_dates: resumeProductSubscriptionResponse.data.subsResumeSubscription.subscription_dates
                    // }
                    // setSubscriptionListState(newState);

                    //refetch is necessary as the data remains the same after page reload without it even with a no-cache fetchPolicy
                    await refetchSubscriptionList().then(() => {
                        setIsSubmitting(false);
                        addToast({
                            type: 'info',
                            message: formatMessage({
                                id: 'productSubscription.resumeProductSubscriptionToast',
                                defaultMessage: 'Thank you. Your subscription will now resume.'
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
        []
    );

    const [cancelProductSubscription, { error: cancelProductSubscriptionError }] = useMutation(
        cancelSubscriptionDeliveryMutation,
        {
            fetchPolicy: 'no-cache'
        }
    );

    const handleCancelProductSubscription = useCallback(
        async (orderNumber, index) => {
            setIsSubmitting(true);
            try {
                const cancelProductSubscriptionResponse = await cancelProductSubscription({
                    variables: {
                        original_order_number: orderNumber
                    }
                });
                console.log(cancelProductSubscriptionResponse);
                if (cancelProductSubscriptionResponse) {
                    //refetch is necessary as the data remains the same after page reload without it even with a no-cache fetchPolicy
                    await refetchSubscriptionList().then(() => {
                        setIsSubmitting(false);
                        addToast({
                            type: 'info',
                            message: formatMessage({
                                id: 'productSubscription.cancelProductSubscriptionToast',
                                defaultMessage: 'something happened - @todo: add info message'
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
        []
    );

    const [updateSubsDeliveryAddress, { error: updateSubsDeliveryAddressError }] = useMutation(
        updateSubsDeliveryAddressMutation,
        {
            fetchPolicy: 'no-cache'
        }
    );

    const handleUpdateSubsDeliveryAddress = useCallback(
        async data => {
            const {
                orderNumber,
                postAction,
                ...formValues
            } = data;
            setIsSubmitting(true);
            try {
                const updateSubsDeliveryAddressResponse = await updateSubsDeliveryAddress({
                    variables: {
                        original_order_number: orderNumber,
                        ...formValues
                    }
                });
                if (updateSubsDeliveryAddressResponse) {
                    //refetch is necessary as the data remains the same after page reload without it even with a no-cache fetchPolicy
                    await refetchSubscriptionList().then(() => {
                        setIsSubmitting(false);
                        postAction ? postAction() : null; // hide modal
                        addToast({
                            type: 'info',
                            message: formatMessage({
                                id: 'productSubscription.addressUpdateSuccess',
                                defaultMessage: 'We have updated your delivery address.'
                            }),
                            dismissable: true,
                            timeout: 8000
                        });
                    });
                } else {
                    addToast({
                        type: 'error',
                        message: formatMessage({
                            id: 'productSubscription.addressUpdateError',
                            defaultMessage: 'We could not update your delivery address. Please verify all the information entered.'
                        }),
                        dismissable: true,
                        timeout: 8000
                    });
                }
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
                setIsSubmitting(false);
            }
        },
        []
    );

    const [updateSubsNextDeliveryDate, { error: updateSubsNextDeliveryDateError }] = useMutation(
        updateSubsNextDeliveryDateMutation,
        {
            fetchPolicy: 'no-cache'
        }
    );

    const handleUpdateSubsNextDeliveryDate = useCallback(
        async (values, index) => {
            setIsSubmitting(true);
            try {
                const updateSubsNextDeliveryDateResponse = await updateSubsNextDeliveryDate({
                    variables: {
                        original_order_number: values.original_order_number,
                        date: values.date
                    }
                });
                console.log(updateSubsNextDeliveryDateResponse);
                if (updateSubsNextDeliveryDateResponse) {
                    const values = updateSubsNextDeliveryDateResponse.data.subsUpdateNextOrderDate;
                    await refetchSubscriptionList();//refetch is necessary as the data remains the same after page reload without it
                    setIsSubmitting(false);
                    addToast({
                        type: 'info',
                        message: formatMessage({
                            id: 'productSubscription.cancelProductSubscriptionToast',
                            defaultMessage: 'Thank you! Your next delivery date is now '+ values.subscription_dates.next_order_date
                        }),
                        timeout: 5000
                    });
                }
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
                setIsSubmitting(false);
            }
        },
        []
    );

    const subscriptionOrderItemErrors = useMemo(
        () =>
            new Map([
                ['skipNextDelivery', skipNextDeliveryError],
                ['pauseProductSubscription', pauseProductSubscriptionError],
                ['resumeProductSubscription', resumeProductSubscriptionError],
                ['cancelProductSubscription', cancelProductSubscriptionError],
                ['updateProductSubscriptionNextDeliveryDate', updateSubsNextDeliveryDateError],
            ]),
        [
            skipNextDeliveryError,
            pauseProductSubscriptionError,
            resumeProductSubscriptionError,
            cancelProductSubscriptionError,
            updateSubsNextDeliveryDateError
        ]
    );

    return {
        handleSkipNextDelivery,
        handlePauseProductSubscription,
        handleResumeProductSubscription,
        handleCancelProductSubscription,
        handleUpdateSubsDeliveryAddress,
        handleUpdateSubsNextDeliveryDate,
        subscriptionOrderItemErrors,
        isSubmitting
    };
};
