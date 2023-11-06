import React from 'react';
import {FormattedMessage} from "react-intl";
import Price from "@magento/venia-ui/lib/components/Price";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./totals.css";

const EditSubscriptionSummaryTotals = (props) => {
    const {
        subscriptionState,
        currency
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <>
            {subscriptionState.totals && currency ?
                <div className={classes.totals}>
                    {subscriptionState.tier ?
                    <div className={classes.hidden}>
                        <div className={classes.totalsText}>
                            <FormattedMessage
                                id={'editSubscriptionSummaryTotals.total'}
                                defaultMessage={'Total'}
                            />
                        </div>
                        <div className={classes.totalsPrice}>
                            <Price currencyCode={currency} value={subscriptionState.totals.total} />
                        </div>
                        <div className={classes.totalsText}>
                            <FormattedMessage
                                id={'editSubscriptionSummaryTotals.discountLabel'}
                                defaultMessage={'Discount ({package})'}
                                values={{
                                    package: subscriptionState.tier.tier_name
                                }}
                            />
                        </div>
                        <div className={classes.totalsPrice}>
                            <Price currencyCode={currency} value={subscriptionState.totals.totalDiscount} />
                        </div>
                    </div>
                        : null
                    }
                    <div className={classes.grandTotalsText}>
                        <div className={classes.totalsText}>
                            <div>
                                <FormattedMessage
                                    id={'editSubscriptionSummaryTotals.grandTotalLabel'}
                                    defaultMessage={'Subscription Total'}
                                />
                            </div>
                            <div className={classes.nextDeliveryDateText}>
                                <FormattedMessage
                                    id={'editSubscriptionSummaryTotals.estimatedDate'}
                                    defaultMessage={
                                        'Estimated next processing date: {date}'
                                    }
                                    values={{
                                        date: <span className={classes.nextDeliveryDate}>
                                        {subscriptionState.subscription_dates.next_order_date}
                                    </span>
                                    }}
                                />
                            </div>
                        </div>
                        <div className={classes.totalsPrice}>
                            <Price currencyCode={currency} value={subscriptionState.totals.grandTotal} />
                        </div>
                    </div>
                </div>
                : null
            }
        </>
    )
}

export default EditSubscriptionSummaryTotals;
