import React, {useState, useEffect} from 'react';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./header.css";
import Icon from "@magento/venia-ui/lib/components/Icon";
import { RefreshCcw as RefreshIcon, ChevronDown, ChevronUp } from 'react-feather';

const ProductSubscriptionListItemHeader = (props) => {
    const {
        moduleConfig,
        subscription,
        handleToggle,
        isOpen
    } = props;

    const {
        original_order_number,
        status,
        subscription_dates: {
            interval
        },
        tier: {
            tier_name
        }
    } = subscription;

    const classes = mergeClasses(defaultClasses, props.classes);

    const [tierColour, setTierColour] = useState('rgb(0,0,0)')

    const subscriptionPackageColour = () => {
        if (moduleConfig && moduleConfig.configuration && moduleConfig.configuration.tiers) {
            moduleConfig.configuration.tiers.filter(tier => (tier.tier_name === tier_name)).map(tier => {
                setTierColour(tier.color);
            })
        }
    }

    useEffect(() => {
        subscriptionPackageColour();
    }, [moduleConfig]);

    return (
        <div className={classes.root} onClick={handleToggle}>
            <div>
                <Icon src={RefreshIcon} height={30} />
            </div>
            <div>
                <div className={classes.package} style={{backgroundColor: tierColour}}>
                    {tier_name ? tier_name : 'N/A'}
                </div>
            </div>
            <div className={classes.headerOrderSummary}>
                <div>Order {original_order_number}</div>
                <div>{interval}</div>
            </div>
            <div>
                {status}
            </div>
            <div>
                <Icon src={isOpen ? ChevronUp : ChevronDown} height={30} />
            </div>
        </div>

    )
}

export default ProductSubscriptionListItemHeader;
