import React from 'react';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./nearestLocations.css";
import DEFAULT_OPERATIONS from "@eshopworld/store-locator/src/components/StoreLocator/storeLocator.gql";
import {useStoreLocatorNearestLocations} from "@eshopworld/store-locator/src/talons/StoreLocator/NearestLocations/useNearestLocations";
import {calculateDistance} from "@eshopworld/store-locator/src/components/StoreLocator/utils";
import {FormattedMessage} from "react-intl";
import StoreLocatorNearestLocation from "./Location";
import {Link} from "react-router-dom";

const StoreLocatorNearestLocations = (props) => {
    const {
        country,
        location,
        locationId
    } = props;

    const {
        getStoreLocatorNearestLocationsQuery
    } = DEFAULT_OPERATIONS;

    const {
        nearestLocations
    } = useStoreLocatorNearestLocations({
        country: country,
        locationId: locationId,
        storeLocatorNearestLocationsQuery: getStoreLocatorNearestLocationsQuery
    });

    const classes = mergeClasses(defaultClasses, props.classes);

    if (!nearestLocations) {
        return null;
    }

    const mapOptions = {
        showFullscreenButton: false,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControlOptions: {
            position: 7,//window.google.maps.ControlPosition.RIGHT_TOP
            style: 1 // window.google.maps.ZoomControlStyle.SMALL
        }
    }

    return (
        <div className={classes.root}>
            <div className={classes.titleWrap}>
                <div className={classes.sectionTitle}>
                    <FormattedMessage id={'storeLocatorNearestLocation.Title'}
                                      defaultMessage={'Nearest Locations'}
                    />
                </div>
                <Link to={'/store-locations'} className={classes.titleLink}>
                    <FormattedMessage id={'storeLocatorNearestLocation.titleLink'}
                                      defaultMessage={'Store Locator'}
                    />
                </Link>
            </div>
            <div className={classes.locations}>
                {nearestLocations.map((nearestLocation, index) => {
                    return <StoreLocatorNearestLocation key={`storeLocatorNearestLocation-${index}`}
                                                        location={nearestLocation}
                                                        mapOptions={mapOptions}
                                                        parentLocation={location}
                                                        parentLat={location.latitude}
                                                        parentLng={location.longitude}
                                                        calculateDistance={calculateDistance}
                    />
                })}
            </div>
        </div>
    )
}

export default StoreLocatorNearestLocations;
