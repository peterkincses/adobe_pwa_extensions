import { useCallback, useState, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {useToasts} from "@magento/peregrine";
import {useIntl} from "react-intl";

export const useUpdateConfigurableCartItem = props => {
    const {
        operations,
        item
    } = props;

    const {
        updateConfigurableCartItemMutation
    } = operations;

    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();

    /**
     * 
     * @param item 
     * @returns ie.
     *   customizable_option_uid: "c3Vic2NyaXB0aW9uX29wdGlvbi9vcHRpb24="
     *   id: 1
     *   label: "Subscription Option"
     *   type: "subscription_option"
     *   values: []
     */
    const getSubsOptsFromItem = (item) => {
        if  (!item) { return null; }
        const customizable_options = item[Object.keys(item).filter(
            key => (
                key.indexOf('customizable_options') > -1
            )
        )];
        const optDelivery = (customizable_options && customizable_options.length) ?
            customizable_options.filter(
                option => (
                    option['type'] === 'subscription_option'
                )
            ) : null
        ;
        return (optDelivery && optDelivery.length) ? optDelivery[0] : null;
    }

    const getOptValuesFromItem = (item) => {
        const optIds = getSubsOptsFromItem(item);
        return (optIds && optIds.values) ? optIds.values[0] : null;
    }

    const [activeOption, setActiveOption] = useState(
        (item && getOptValuesFromItem(item)) ?
            getOptValuesFromItem(item)['customizable_option_value_uid']
            : null
    );

    const [
        updateConfigurableCartItem,
        {
            called: updateConfigurableCartItemCalled,
            error: updateConfigurableCartItemError,
            loading: updateConfigurableCartItemLoading
        }
    ] = useMutation(updateConfigurableCartItemMutation);

    const handleOptionSelected = useCallback(
        async vars => {
            const {
                cartId,
                cartItemUid,
                optionId,
                optionValueString
            } = vars;
            try {
                await updateConfigurableCartItem({
                    variables: {
                        cartId,
                        cartItemUid,
                        optionId,
                        optionValueString
                    }
                });
                setActiveOption(optionValueString);
                addToast({
                    type: 'info',
                    message: formatMessage({
                        id: 'productSubscription.cartUpdateSuccess',
                        defaultMessage: 'We have updated your cart item.'
                    }),
                    dismissable: true,
                    timeout: 8000
                });
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
                addToast({
                    type: 'error',
                    message: formatMessage({
                        id: 'productSubscription.cartUpdateError',
                        defaultMessage: 'We have been unable to update the cart item.'
                    }),
                    dismissable: true,
                    timeout: 8000
                });
            }
        },
        [
            updateConfigurableCartItem, activeOption, setActiveOption
        ]
    );

    const errors = useMemo(
        () =>
            new Map([
                ['updateConfigurableCartItemMutation', updateConfigurableCartItemError]
            ]),
        [updateConfigurableCartItemError]
    );

    return {
        handleOptionSelected,
        updateConfigurableCartItemLoading,
        errors,
        getSubsOptsFromItem,
        getOptValuesFromItem,
        activeOption,
        setActiveOption
    };
};
