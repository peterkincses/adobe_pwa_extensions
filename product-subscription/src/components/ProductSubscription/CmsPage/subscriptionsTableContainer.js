import React from 'react';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./subscriptionsTableContainer.css";
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";
import {FormattedMessage} from "react-intl";
import LinkButton from "@magento/venia-ui/lib/components/LinkButton";
import Button from "@magento/venia-ui/lib/components/Button";
import {useHistory} from "react-router-dom";
import SubscriptionsTable from "./subscriptionsTable";

const SubscriptionsTableContainer = (props) => {

    const {
        errors,
        tierData,
        loading,
        currency,
        parent,
        toggleSubscriptionModalVisibility
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    const history = useHistory();

    if (loading || !tierData || !currency) {
        return <LoadingIndicator />
    }

    const canPrice = 40;

    const handleNavigateToSubscriptions = () => {
        toggleSubscriptionModalVisibility();
        history.push('/subscriptions');
    }

    const handleContinue = () => {
        history.push('/')
    }

    return (
        <div className={parent === 'cmsPage' ? classes.rootCms : classes.root}>
            <div className={classes.title}>
                <FormattedMessage id={'subscriptionsCmsTableContainerTitle'}
                                  defaultMessage={'Our subscription plans'}
                />
            </div>
            {parent === 'cmsPage'?
            <div className={classes.titleCopy}>
                <FormattedMessage id={'subscriptionsCmsTableContainerTitleCopy'}
                                  defaultMessage={'Mix and match between a variety of flavours and strengths. It’s the simple, cost-effective way to buy your pouches.'}
                />
            </div> : null }
            <SubscriptionsTable tierData={tierData} currency={currency}/>
            <div className={classes.copy}>
                <p>
                    <FormattedMessage id={'subscriptionsCmsTableContainer.dispatchNote'}
                                      defaultMessage={'Your subscription will be dispatched on the same date each month, with free delivery.'}
                    />
                </p>
                <p>
                    <FormattedMessage id={'subscriptionsCmsTableContainer.cancelOrPause'}
                                      defaultMessage={'You are in control — you can pause, skip or cancel your deliveries at any time from “My Account”.'}
                    />
                </p>
            </div>
            <div className={classes.actions}>
                {parent === 'infoModal'?
                    <LinkButton className={classes.learnMore} onClick={handleNavigateToSubscriptions}>
                        <FormattedMessage id={'subscriptionsCmsTableContainer.ctaLabel'}
                                          defaultMessage={'More about %storeName subscriptions'}
                        />
                        <span className={classes.linkIcon}>
                                →
                            </span>
                    </LinkButton> : null
                }
                {parent === 'cmsPage'?
                    <Button priority="high" onClick={handleContinue}>
                        <FormattedMessage id={'subscriptionsCmsTableContainer.continueShopping'}
                                          defaultMessage={'Continue shopping'}
                        />
                    </Button> : null
                }
            </div>
        </div>
    )
}

export default SubscriptionsTableContainer;
