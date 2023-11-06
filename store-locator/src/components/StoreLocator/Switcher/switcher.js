import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './switcher.css';
import {FormattedMessage} from "react-intl";

const StoreLocatorViewSwitcher = (props) => {
    const {
        view,
        toggleView
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.toggleView}>
            <div onClick={() => toggleView('map')}
                 className={view === 'map' ? classes.toggleSelected : classes.toggle}>
                <FormattedMessage id={'storeLocatorToggle.map'}
                                  defaultMessage={'Map'}
                />
            </div>
            <div onClick={() => toggleView('list')}
                 className={view === 'list' ? classes.toggleSelected : classes.toggle}>
                <FormattedMessage id={'storeLocatorToggle.list'}
                                  defaultMessage={'List'}
                />
            </div>
        </div>
    );
}

export default StoreLocatorViewSwitcher;
