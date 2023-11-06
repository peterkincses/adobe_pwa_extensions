import React, {useEffect, useState} from 'react';
import {useSearch} from "@eshopworld/store-locator/src/talons/StoreLocator/Search/useSearch";

export const useMap = (props) => {
    const {handleSearch} = useSearch();

    const {
        countryCode,
        countryFullName,
        locations,
        storeLocatorConfig,
        selectedLocation,
        setSelectedLocation
    } = props;

    const {
        zoom
    } = storeLocatorConfig;

    const [mapOptions, setMapOptions] = useState({
        componentRestrictions: { country: countryCode },//https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
        showFullscreenButton: false,
        mapTypeControl: false,
        fullscreenControl: false,
        zoomControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_TOP,
            style: window.google.maps.ZoomControlStyle.SMALL
        },
        streetViewControl: false,
        types: ["(cities)"],//@todo: check https://developers.google.com/maps/documentation/javascript/supported_types?hl=en_US
    });
    const [googleMap, setGoogleMap] = useState(null);
    const [mapZoom] = useState(Number(zoom));
    const [mapCenter, setMapCenter] = useState({lat: 0, lng: 0});

    const handleOnLoad = (map) => {
        setGoogleMap(map);
        initAutoComplete(window.google.maps.places);
        initGeoCoder(window.google.maps, map);
    };

    const initAutoComplete = (places) => {
        const searchInput = document.getElementById("storeLocatorSearch");
        const autocomplete = new places.Autocomplete(searchInput, mapOptions);
        autocomplete.addListener('place_changed', function() {
            const place = autocomplete.getPlace();
            if (place && place.formatted_address) {
                handleSearch({search: place.formatted_address});
            }
        });
    }

    // locations returned: display locations using fitBounds (all locations visible on map)
    // no locations are returned: show country map
    const initGeoCoder = (maps, map) => {
        const Geocoder = new maps.Geocoder();
        const bounds = new maps.LatLngBounds();
        if (locations.length > 0 && locations.length < 11) {
            locations.forEach((location) => bounds.extend({
                lat: Number(location.latitude),
                lng: Number(location.longitude)
            }));
            map.fitBounds(bounds);
        } else {
            Geocoder.geocode({ address: countryFullName }, (results, status) => {
                if (status === 'OK') {
                    map.setCenter({
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    })
                } else {
                    console.log('Geocode was not successful for the following reason: ' + status);
                }
            });
        }
    }

    const handleActiveMarker = (marker) => {
        if (marker === selectedLocation) {
            return;
        }
        setSelectedLocation(marker);
    };

    useEffect(() => {
        if (!selectedLocation || !googleMap) { return null };
        googleMap.panTo({
            lat: Number(selectedLocation.latitude),
            lng: Number(selectedLocation.longitude)
        })
    }, [selectedLocation, googleMap]);

    return {
        handleOnLoad,
        handleActiveMarker,
        mapOptions,
        zoom: mapZoom,
        center: mapCenter
    }
};
