import React, {useMemo, useRef, useState, Fragment, useEffect} from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './switcher.css';
import {FormattedMessage, useIntl} from 'react-intl';
import CmsBlock from "@magento/venia-ui/lib/components/CmsBlock";
import useLocation from "@magento/venia-product-recommendations/lib/collector/hooks/useLocation";

const MixAndMatchCategorySwitcher = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const location = useLocation();
    const categoryFilterTriggerRef = useRef();
    const switcherCmsRef = useRef();
    const { formatMessage } = useIntl();
    const defaultLabel = formatMessage({
        id: 'mixAndMatchSwitcher.defaultLabel',
        defaultMessage: 'Other categories'
    });
    const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
    const [cmsSwitcher, setCmsSwitcher] = useState([]);
    const [selectedCategoryLabel, setSelectedCategoryLabel] = useState(defaultLabel);

    const handleTriggerClick = () => {
        setIsSwitcherOpen(!isSwitcherOpen);
    }

    const switcherClassName = isSwitcherOpen ? classes.switcher_open : classes.switcher;

    useEffect(() => {
        setTimeout(() => {
            if (!cmsSwitcher.length) {
                const mmSwitcher = switcherCmsRef.current ? switcherCmsRef.current.getElementsByTagName('a') : null;
                if (mmSwitcher && mmSwitcher.length) {
                    Object.values(mmSwitcher).map(link => {
                        if (typeof link.href !== undefined) {
                            const path = link.href.replace(window.origin, '');
                            if (path === location.pathname) {
                                setSelectedCategoryLabel(link.innerText);
                            }
                        }
                    });
                    setCmsSwitcher(mmSwitcher);
                }
            }
        }, 1500)
    }, [location]);

    const switcherButton = useMemo(() => {
        if (!cmsSwitcher.length) { return null }

        return  <button
            ref={categoryFilterTriggerRef}
            className={classes.trigger}
            onClick={handleTriggerClick}
        >
            <span className={classes.triggerLabel}>
                <FormattedMessage
                    id={'mixAndMatchCategorySwitcher.heading'}
                    defaultMessage={'Clothing Type'}
                />
            </span>
            <span>{selectedCategoryLabel}</span>
        </button>
    }, [selectedCategoryLabel, isSwitcherOpen, cmsSwitcher])

    return (
        <Fragment>
            <div className={classes.root} ref={switcherCmsRef}>
                <div className={switcherClassName}>
                    {switcherButton}
                    <CmsBlock identifiers={'mix-and-match-category-switcher'} />
                </div>
            </div>
        </Fragment>
    );
};

export default MixAndMatchCategorySwitcher;
