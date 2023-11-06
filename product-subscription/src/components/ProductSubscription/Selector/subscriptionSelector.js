import React, {useCallback, useState} from 'react';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./subscriptionSelector.css";
import { FormattedMessage } from 'react-intl';
import Price from "@magento/venia-ui/lib/components/Price";
import {RadioGroup} from 'informed';
import Radio from "@magento/venia-ui/lib/components/RadioGroup/radio";
import { useUpdateConfigurableCartItem } from '../../../peregrine/lib/talons/ProductSubscriptions/useUpdateConfigurableCartItem';
import { UPDATE_CONFIGURABLE_CART_ITEM_MUTATION } from "./subscriptionSelector.gql";
import {useCartContext} from "@magento/peregrine/lib/context/cart";
import {useModuleConfig} from 'useModuleConfig';
import Icon from "@magento/venia-ui/lib/components/Icon";
import {Info} from 'react-feather';
import {useProductSubscriptionInfoModal} from "../../../peregrine/lib/talons/ProductSubscriptions/useProductSubscriptionInfoModal";

const SubscriptionSelector = (props) => {
    const { moduleConfig } = useModuleConfig({
        modules: ['subscribepro']
    });

    const {
        component,
        componentProps
    } = props;

    const {
        item,
        product: productProp
    } = componentProps;

    const talonProps = useUpdateConfigurableCartItem({
        operations: {
            updateConfigurableCartItemMutation: UPDATE_CONFIGURABLE_CART_ITEM_MUTATION
        },
        item
    });

    const {
        handleOptionSelected,
        updateConfigurableCartItemLoading,
        getOptValuesFromItem,
        activeOption,
        setActiveOption
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const [{ cartId }] = useCartContext();

    const product = productProp ? productProp : item.product; // item means cart item
    const currency = (product && product.price_range) ? product.price_range.minimum_price.regular_price.currency : (item && item.prices) ? item.prices.price.currency : "GBP";

    if (!item && !activeOption){
        setActiveOption(
            product.options ?
                    product.options[0].value[0].uid // first option
                    : 'unknown'
        )
    }

    const subscriptionOptions = (product.options && product.options.length) ?
        product.options.filter(
            option => (
                option['uid'] === 'subscription_option'
            )
        ) : null;

    const handleOptionClicked = useCallback(
        (event, optionUid) => {
            if (!item) {
                setActiveOption(optionUid)
            } else {
                if (updateConfigurableCartItemLoading){ return; }
                if (optionUid === activeOption){ return; }

                event.currentTarget.blur(); // lose focus

                const opts = getOptValuesFromItem(item) ? getOptValuesFromItem(item) : {}; // or getOptIdsFromItem(item);
                const {
                    id
                } = opts;

                handleOptionSelected({
                    cartId,
                    cartItemUid: item.uid,
                    optionId: id,
                    optionValueString: optionUid
                });
            }
        }, [item]
    );

    const {
        toggleSubscriptionModal
    } = useProductSubscriptionInfoModal();

    const getRadioButtonLabel = (option) => {
        const {
            title,
            price
        } = option;
        return <>
                <span className={classes.labelText}>
                    {title}
                </span>
                <span className={classes.subscriptionOptionPriceWrap}>
                    <span className={classes.subscriptionOptionPrice}>
                        <Price currencyCode={currency} value={price} />
                    </span>
                    <span className={classes.subscriptionOptionPriceLabel}>
                        <FormattedMessage
                            id={'subscriptionSelector.perPack'}
                            defaultMessage={'per pack'}
                        />
                    </span>
                </span>
                {title === 'Subscription' || title === 'Prenumerera' ?
                    <span className={classes.infoIcon} onClick={toggleSubscriptionModal}>
                        <Icon src={Info} size={16} />
                    </span> : null
                }
        </>;
    }

    const radioButtons = (subscriptionOptions && subscriptionOptions.length) ?
        subscriptionOptions[0].value.map((option, index) => {
            return (
                <div key={'subscription-option-' +index}
                     className={option.uid === activeOption ? classes.selectedOption : updateConfigurableCartItemLoading ? classes.radio_Loading : classes.option}
                >
                    <Radio
                        label={getRadioButtonLabel(option)}
                        value={option.uid}
                        onClick={(e) => handleOptionClicked(e, option.uid)}
                        classes={{
                            root: classes.radio_label,
                            label: classes.radio_textWrap,
                            icon: classes.radio_icon,
                            input: classes.radio_input
                        }}
                    />
                </div>
            );
        }
    ) : null;

    const radioGroupOpts = {};
    if (item) {
        radioGroupOpts['fieldState'] = { value: activeOption }; // makes the currently selected radio that of `activeOption`
    }

    return moduleConfig && moduleConfig.enabled && radioButtons ?
        <div className={component === 'productCompactDetail' ? classes.rootShort : classes.root}>
            <RadioGroup
                field="selected_options[]"
                initialValue={activeOption}
                {...radioGroupOpts}
            >
                {radioButtons}
            </RadioGroup>
        </div> : null
}

export default SubscriptionSelector;
