import React from 'react';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from './map.css';
import { GoogleMap } from "@react-google-maps/api";
import Marker from './Marker';
import {useStoreLocatorContext} from "@eshopworld/store-locator/src/components/StoreLocator/storeLocator";
import {useMap} from "@eshopworld/store-locator/src/talons/StoreLocator/Map/useMap";

const StoreLocatorMap = (props) => {
    const {
        countryCode,
        countryFullName,
        storeConfig,
        storeLocatorConfig,
        locations,
        setSelectedLocation,
        storeLocatorState
    } = useStoreLocatorContext();

    const {
        searchQuery,
        selectedLocation,
        view
    } = storeLocatorState;

    const {
        center,
        handleActiveMarker,
        handleOnLoad,
        mapOptions,
        zoom
    } = useMap({
        countryCode,
        countryFullName,
        locations,
        searchQuery,
        storeConfig,
        storeLocatorConfig,
        selectedLocation,
        setSelectedLocation
    });

    const classes = mergeClasses(defaultClasses, props.classes);
    const mapClass = view === 'map' ? classes.root : classes.listView;

    return (
        <GoogleMap
            onLoad={handleOnLoad}
            onClick={() => setSelectedLocation(null)}
            mapContainerClassName={mapClass}
            options={mapOptions}
            center={center}
            zoom={zoom}
        >
            {locations && locations.map((location, key) => (
                <Marker location={location}
                        key={`store-locator-marker-${key}`}
                        label={`${key+1}`}
                        counter={key + 1}
                        handleActiveMarker={handleActiveMarker}
                        setActiveMarker={setSelectedLocation}
                        activeMarker={selectedLocation}
                />
            ))}
        </GoogleMap>
    )
}

export default StoreLocatorMap;
