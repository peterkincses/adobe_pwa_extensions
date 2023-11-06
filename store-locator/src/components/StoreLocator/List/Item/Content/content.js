import React from 'react';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from './content.css';
import StoreLocatorLocationStatus from "../LocationStatus";
import {FormattedMessage} from "react-intl";
import Link from "@magento/venia-ui/lib/components/Link";

const StoreLocatorListItemContent = (props) => {
    const {
        location,
        counter
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    if (!location) {
        return null
    }

    const {
        city,
        latitude,
        location_id,
        longitude,
        name,
        openCloseData,
        postal_code,
        state_province,
        street
    } = location;

    return (
        <div className={classes.root}>
            <div>
                <div className={classes.counter}>
                    {counter}
                </div>
                {/*<div className="miles">40 mi</div>*/}
            </div>
            <div className={classes.nameAddress}>
                <div className={classes.storeName}>
                    <Link to={`/store-location/${location_id}`}>
                        {name}
                    </Link>
                </div>
                <StoreLocatorLocationStatus openCloseData={openCloseData} />
                <div className={classes.address}>
                    {street}, {city}, {state_province}, {postal_code}
                </div>
                <div className={classes.storeLinks}>
                    {latitude && longitude &&
                        <a href={`//google.com/maps?daddr=${latitude},${longitude}`} target="_blank">
                            <FormattedMessage id={'storeLocator.directionsLinkText'}
                                              defaultMessage={'Get Directions'}
                            />
                        </a>
                    }
                    <Link to={`/store-location/${location_id}`}>
                        <FormattedMessage id={'storeLocator.storeDetailsLinkText'}
                                          defaultMessage={'Store Details'}
                        />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default StoreLocatorListItemContent;
