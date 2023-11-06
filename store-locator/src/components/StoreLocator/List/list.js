import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './list.css';
import StoreLocatorListItem from './Item';
import StoreLocatorViewSwitcher from "../Switcher";
import {FormattedMessage} from "react-intl";
import {useStoreLocatorContext} from "../storeLocator";

const StoreLocatorList = (props) => {
    const {
        handleToggleView,
        totalCount,
        locations,
        setSelectedLocation,
        storeLocatorState
    } = useStoreLocatorContext();

    const classes = mergeClasses(defaultClasses, props.classes);

    if (!storeLocatorState) {
        return null;
    }

    const {
        searchQuery,
        selectedLocation,
        view
    } = storeLocatorState;

    if (searchQuery && !locations.length) {
        return (
            <p className={classes.noResults}>
                <FormattedMessage id={'storeLocator.noSearchResultText'}
                                  defaultMessage={`Sorry, there are no locations in this area.`}
                />
            </p>
        )
    }

    if (!locations.length) {
        return null;
    }

    const viewModeClass = view === 'map' ? classes.mapView : classes.listView;

    return (
        <div className={classes.root}>
            <div className={classes.summary}>
                {!!totalCount &&
                    <div className={classes.resultsCount}>
                        <FormattedMessage id={'storeLocatorList.nearbyLocationsText'}
                                          defaultMessage={'{totalCount} Nearby Locations'}
                                          values={{
                                              totalCount: totalCount
                                           }}
                        />
                    </div>
                }
                <StoreLocatorViewSwitcher view={view} toggleView={handleToggleView} />
            </div>
            <div className={`${classes.result} ${viewModeClass}`}>
                <ol className={classes.items}>
                    {locations.map((location, index) => {
                        return <StoreLocatorListItem view={view}
                                                     key={'storeLocatorListItem-' + index}
                                                     counter={index + 1}
                                                     data={location}
                                                     selectedLocation={selectedLocation}
                                                     setSelectedLocation={setSelectedLocation}
                        />
                    })}
                </ol>
            </div>
        </div>
    );
}

export default StoreLocatorList;
