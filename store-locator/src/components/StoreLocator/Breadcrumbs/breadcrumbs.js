import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './breadcrumbs.css';
import { string } from 'prop-types';
import { Link } from 'react-router-dom';
import {FormattedMessage} from "react-intl";

const Breadcrumbs = props => {
    const { pageType, location, searchQuery } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={`${classes.root} ${classes.gridArea}`}>
            <Link className={classes.link} to="/store-locations">
                <FormattedMessage id={'storeLocatorBreadcrumbs.locations'}
                                  defaultMessage={'Locations'}
                />
            </Link>
            {pageType === 'landing' &&
                <>
                    <span className={classes.divider}>/</span>
                    <span className={classes.text}>
                        <FormattedMessage id={'storeLocatorBreadcrumbs.searchResults'}
                                          defaultMessage={'Search Results'}
                        />
                    </span>
                </>
            }
            {searchQuery &&
                <>
                    <span className={classes.divider}>/</span>
                    <span className={classes.text}>{searchQuery}</span>
                </>
            }
            {
                location && location.city &&
                <>
                    <span className={classes.divider}>/</span>
                    <Link className={classes.link} to={`/store-locations?q=${location.city}`}>
                        {location.city}
                    </Link>
                </>
            }
            {
                location &&
                <>
                    <span className={classes.divider}>/</span>
                    <span className={classes.text}>{location.name}</span>
                </>
            }
        </div>
    );
};

Breadcrumbs.propTypes = {
    pageTitle: string
};

Breadcrumbs.defaultProps = {
    pageTitle: ''
};

export default Breadcrumbs;
