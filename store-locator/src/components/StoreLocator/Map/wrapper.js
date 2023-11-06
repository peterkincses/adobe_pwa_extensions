import React from 'react';
import { useLoadScript } from "@react-google-maps/api";
import StoreLocatorMap from "./map";
import {useStoreLocatorContext} from "../storeLocator";

export default function Wrapper(props) {
    const {
        storeLocatorConfig
    } = useStoreLocatorContext();

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: storeLocatorConfig.keyMap,
        libraries: ["places"]
    });

    return isLoaded ? <StoreLocatorMap/> : null;
}
