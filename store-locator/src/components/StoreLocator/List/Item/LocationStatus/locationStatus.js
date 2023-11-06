import React from 'react';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from './locationStatus.css';
import {FormattedMessage} from "react-intl";

const StoreLocatorLocationStatus = (props) => {
    const {
        openCloseData
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    if (!openCloseData) {
        return null;
    }

    return (
        <div className={classes.root}>
            <span className={openCloseData.status === 'open' ? classes.status : classes.statusClosed}>
                {openCloseData.status === 'open' ?
                    <FormattedMessage id={'storeLocatorStatus.open'}
                                      defaultMessage={'Open'}
                    />
                    :
                    <FormattedMessage id={'storeLocatorStatus.closed'}
                                      defaultMessage={'Closed'}
                    />
                }
            </span>
            <span className={classes.closeTime}>
                {openCloseData.label}
            </span>
        </div>
    )
}

export default StoreLocatorLocationStatus;
