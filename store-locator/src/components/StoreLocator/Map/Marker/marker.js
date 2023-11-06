import React from "react";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from './marker.css';
import { InfoWindow, Marker } from "@react-google-maps/api";
import StoreLocatorListItemContent from "../../List/Item/Content";

const StoreLocatorLocationMarker = (props) => {
    const {
        location,
        handleActiveMarker,
        activeMarker,
        setActiveMarker,
        counter,
        label
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    if (!location) { return null }

    const {
        latitude,
        longitude
    } = location;

    return (
        <Marker
            position={{
                lat: Number(latitude),
                lng: Number(longitude)
            }}
            onClick={() => handleActiveMarker(location)}
            label={label}
        >
            {activeMarker && activeMarker.location_id === location.location_id ? (
                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                    <div className={classes.infoWindowWrap}>
                        <StoreLocatorListItemContent location={location}
                                                     classes={{
                                                         root: classes.infoWindow
                                                     }}
                                                     counter={counter}
                        />
                    </div>
                </InfoWindow>
            ) : null}
        </Marker>
    )
}

export default StoreLocatorLocationMarker;
