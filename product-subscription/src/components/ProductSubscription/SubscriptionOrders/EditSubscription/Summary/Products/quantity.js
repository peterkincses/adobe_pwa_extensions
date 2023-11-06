import React from "react";
import Icon from "@magento/venia-ui/lib/components/Icon";
import TextInput from "@magento/venia-ui/lib/components/TextInput";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./quantity.css";
import {Minus as MinusIcon, Plus as PlusIcon} from 'react-feather';
import {useIntl} from "react-intl";
import {useFieldApi, useFieldState} from "informed";
import {useQuantity} from "../../../../../../peregrine/lib/talons/ProductSubscriptions/Edit/useEditProductSubscriptionSummaryProductQuantity";

const EditSubscriptionSidebarQuantity = (props) => {
    const { item, initialValue, min, onChange, index } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const {
        isDecrementDisabled,
        isIncrementDisabled,
        handleBlur,
        handleDecrement,
        handleIncrement,
        maskInput
    } = useQuantity({
        item,
        index,
        initialValue,
        min,
        onChange
    });

    return (
        <div className={classes.root}>
            <button
                aria-label={formatMessage({
                    id: 'quantity.buttonDecrement',
                    defaultMessage: 'Decrease Quantity'
                })}
                className={classes.button_decrement}
                disabled={isDecrementDisabled}
                onClick={handleDecrement}
                type="button"
            >
                <Icon src={MinusIcon} size={22} />
            </button>
            <TextInput
                aria-label={formatMessage({
                    id: 'quantity.input',
                    defaultMessage: 'Item Quantity'
                })}
                classes={{ input: classes.input }}
                field={'quantity['+index+']'}
                id={item.id}
                inputMode="numeric"
                mask={maskInput}
                min={min}
                onBlur={handleBlur}
                pattern="[0-9]*"
            />
            <button
                aria-label={formatMessage({
                    id: 'quantity.buttonIncrement',
                    defaultMessage: 'Increase Quantity'
                })}
                className={classes.button_increment}
                disabled={isIncrementDisabled}
                onClick={handleIncrement}
                type="button"
            >
                <Icon src={PlusIcon} size={20} />
            </button>
        </div>
    )
}

export default EditSubscriptionSidebarQuantity
