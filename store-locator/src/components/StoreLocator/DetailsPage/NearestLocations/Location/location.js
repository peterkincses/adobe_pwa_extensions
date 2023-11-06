import React from 'react';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./location.css";
import {FormattedMessage} from "react-intl";
import Link from "@magento/venia-ui/lib/components/Link";
import GoogleMapReact from 'google-map-react';
import locationPin from '../../../Icons/locationPinMobile.svg';
import Image from "@magento/venia-ui/lib/components/Image";

const StoreLocatorNearestLocation = (props) => {
    const {
        calculateDistance,
        location,
        mapOptions,
        parentLat,
        parentLng
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

    const locationLatLng = {
        lat: Number(latitude),
        lng: Number(longitude)
    };

    const initMap = ({maps, map}) => {
        new maps.Marker({
            position: locationLatLng,
            map: map,
        })
    }

    const distance = calculateDistance(
        Number(parentLat),
        Number(parentLng),
        Number(latitude),
        Number(longitude)
    )

    return (
        <div className={classes.root}>
            <div className={classes.locationDetails}>
                <div>
                    <Image alt={'rr'} src={locationPin} size={18} />
                </div>
                <div className={classes.nameAddress}>
                    <Link to={`/store-location/${location_id}`} className={classes.storeNameLink}>
                        {name}
                    </Link>
                    <div className={classes.address}>
                        {street}, {city}, {state_province}, {postal_code}
                    </div>
                    <div className={classes.distance}>
                        <FormattedMessage id={'storeLocator.locationDistance'}
                                          defaultMessage={'{distance} mile away'}
                                          values={{
                                              distance
                                          }}
                        />
                    </div>
                    <div className={classes.directionLink}>
                        {latitude && longitude &&
                            <a href={`//google.com/maps?daddr=${latitude},${longitude}`} target="_blank">
                                <FormattedMessage id={'storeLocator.directionsLinkText'}
                                                  defaultMessage={'Get Directions'}
                                />
                            </a>
                        }
                    </div>
                </div>
            </div>
            <div className={classes.mapContainer}>
                <GoogleMapReact
                    center={locationLatLng}
                    onGoogleApiLoaded={initMap}
                    options={mapOptions}
                    zoom={15}
                />
            </div>
        </div>
    )
}

export default StoreLocatorNearestLocation;
