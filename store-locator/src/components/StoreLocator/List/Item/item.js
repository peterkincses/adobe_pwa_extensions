import React, {useRef, useEffect} from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './item.css';
import StoreLocatorListItemContent from "./Content";
import {useStoreLocatorContext} from "@eshopworld/store-locator/src/components/StoreLocator/storeLocator";

const StoreLocatorListItem = (props) => {
    const {
        counter,
        data,
        view
    } = props;

    const {
        storeLocatorState: {
            selectedLocation
        },
        setSelectedLocation
    } = useStoreLocatorContext();

    const classes = mergeClasses(defaultClasses, props.classes);
    const viewModeClass = view === 'map' ? classes.mapView : classes.listView;
    const itemRef = useRef(null);

    if (!data) {
        return null;
    }

    const handleClick = () => {
        setSelectedLocation(data);
    }

    useEffect(() => {
        if (
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(max-width: 767.98px)').matches
        ) {
            if (selectedLocation === data) {
                itemRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }
    }, [selectedLocation, data]);

    return (
        <li className={`${selectedLocation === data ? classes.rootSelected : classes.root} ${viewModeClass}`}
            onClick={handleClick}
            ref={itemRef}
        >
            <StoreLocatorListItemContent location={data} counter={counter} />
        </li>
    );
};

export default StoreLocatorListItem;
