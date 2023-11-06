import React, {useRef} from 'react';
import FormError from "@eshopworld/core/src/components/FormError";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./errors.css";
import {useIntl} from "react-intl";
import ErrorMessage from "@eshopworld/core/src/components/ErrorMessage";
import {useScrollIntoView} from "@magento/peregrine/lib/hooks/useScrollIntoView";

const MixAndMatchErrors = (props) => {
    const {
        formErrors
    } = props;

    const { formatMessage } = useIntl();
    const classes = mergeClasses(defaultClasses, props.classes);
    const errorRef = useRef(null);
    useScrollIntoView(errorRef, formErrors.length);

    if (!formErrors.length) {
        return null;
    }

    return (
        <div ref={errorRef}>
            {formErrors.map((error, index) => {
                let message = error.message;
                if (
                    message.includes(
                        'There are no source items with the in stock status'
                    ) ||
                    message.includes(
                        'Variable "$parentSku" of required type "String!" was not provided.'
                    )
                ) {
                    message = formatMessage({
                                id: 'productFullDetail.errorChildStock',
                                defaultMessage: 'This product is out of stock.'
                    });
                }
                return (
                    <ErrorMessage classes={classes} key={'mixAndMatchError-'+ index}>
                        {error.product.name}: {message}
                    </ErrorMessage>
                )
            })}
        </div>
    )
}

export default MixAndMatchErrors;
