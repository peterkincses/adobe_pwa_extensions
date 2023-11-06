import React from 'react';
import CmsBlock from "@magento/venia-ui/lib/components/CmsBlock/cmsBlock";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./subscriptionsCms.css";
import {useProductSubscriptionsCms} from "../../../peregrine/lib/talons/ProductSubscriptions/Cms/useProductSubscriptionsCms";
import {GET_STORE_CONFIG} from "../productSubscription.gql";
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";
import SubscriptionsTableContainer from "./subscriptionsTableContainer";

const SubscriptionsCmsPage = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const {
        errors, loading, tierData, currency
    } = useProductSubscriptionsCms({
        getStoreConfigQuery: GET_STORE_CONFIG
    });

    if (loading || !tierData || !currency) {
        return <LoadingIndicator />
    }

    return (
        <div className={classes.root}>
            <CmsBlock identifiers={'pwa-subscriptions-landing-top'} />
            <SubscriptionsTableContainer loading={loading}
                                errors={errors}
                                tierData={tierData}
                                currency={currency}
                                parent="cmsPage"
            />
            <CmsBlock identifiers={'pwa-subscriptions-landing-bottom'} />
        </div>
 )
}

export default SubscriptionsCmsPage;
