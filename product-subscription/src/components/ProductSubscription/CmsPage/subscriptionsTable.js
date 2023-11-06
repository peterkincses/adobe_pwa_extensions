import React from 'react';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./subscriptionsTable.css";
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";
import {FormattedMessage} from "react-intl";
import Price from "@magento/venia-ui/lib/components/Price";
import LinkButton from "@magento/venia-ui/lib/components/LinkButton";
import Button from "@magento/venia-ui/lib/components/Button";
import {useHistory} from "react-router-dom";

const SubscriptionsTable = (props) => {

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
        <div className={classes.root}>
            {tierData.map((tier, index) => {
                const tierHeadingClass = index === 2 ? classes.packageNameGold : index === 1 ? classes.packageNameSilver : classes.packageNameBronze
                return (
                    <div className={classes.column} key={'subscriptionTable-column-'+index}>
                        <div className={classes.heading}>
                            <div className={tierHeadingClass}>
                                {tier.tier_name}
                            </div>
                            <div className={classes.tier}>
                            <span>
                                <FormattedMessage id={'subscriptionsCmsTablePackageQty'}
                                                  defaultMessage={'{min_qty}-{max_qty} cans'}
                                                  values={{min_qty: tier.min_qty, max_qty: tier.max_qty}}
                                />
                            </span>
                                <FormattedMessage id={'subscriptionsCmsTablePackageQtyInterval'}
                                                  defaultMessage={' per month'}
                                />
                            </div>
                        </div>
                        <div className={classes.breakdown}>
                            <div>
                                <FormattedMessage id={'susbcriptionsCmsTableWithoutSubscription'}
                                                  defaultMessage={'Without Subscription'}
                                />
                            </div>
                            <div>
                                <FormattedMessage id={'susbcriptionsCmsTableWithSubscription'}
                                                  defaultMessage={'With Subscription'}
                                />
                            </div>
                            <div>
                                <div className={classes.price}>
                                    <Price currencyCode={currency} value={canPrice} /> / <FormattedMessage id={'susbcriptionsCmsTableCan'} defaultMessage={'can'}/>
                                </div>
                            </div>
                            <div>
                                <div className={classes.price}>
                                    <Price currencyCode={currency} value={(canPrice * (100 - tier.discount))/100} /> / <FormattedMessage id={'susbcriptionsCmsTableCan'} defaultMessage={'can'}/>
                                </div>
                                <div className={classes.discount}>
                                    <FormattedMessage id={'susbcriptionsCmsTablePackageDiscount'}
                                                      defaultMessage={'save {discount}%'}
                                                      values={{
                                                          discount: tier.discount
                                                      }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default SubscriptionsTable;
