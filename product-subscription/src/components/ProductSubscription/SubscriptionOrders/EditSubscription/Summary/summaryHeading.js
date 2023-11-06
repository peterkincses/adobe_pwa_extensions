import React, {useState, useEffect} from 'react';
import {FormattedMessage, useIntl} from "react-intl";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./summary.css";

const EditSubscriptionSummaryHeading = (props) => {
    const {
        subscriptionState
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    const {tier} = subscriptionState;

    const tierName = tier ? tier.tier_name : null;
    const bg = tier && tier.color ? tier.color : "#E98852";

    return (
        <div className={classes.sidebarHeading} style={{background: bg}}>
            <div className={classes.sidebarTitle}>
                <FormattedMessage
                    id={'editSubscriptionPage.summaryHeading'}
                    defaultMessage={
                        'Your {tierName} subscription'
                    }
                    values={{
                        tierName: tierName
                    }}
                />
            </div>
            {tier && tier.min_qty && tier.max_qty ?
                <div className={classes.sidebarSubTitle}>
                    <FormattedMessage
                        id={'editSubscriptionPage.summaryHeadingPackageInfo'}
                        defaultMessage={
                            '({min_qty}-{max_qty} packs per month)'
                        }
                        values={{
                            min_qty: tier ? tier.min_qty : null,
                            max_qty: tier ? tier.max_qty : null,
                        }}
                    />
                </div> : null
            }
        </div>
    )
}

export default EditSubscriptionSummaryHeading;
