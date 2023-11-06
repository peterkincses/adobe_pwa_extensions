import React from 'react';
import {StoreTitle} from "@magento/venia-ui/lib/components/Head";
import {FormattedMessage, useIntl} from "react-intl";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "@bat/account-landing-page/src/components/AccountLandingPage/accountLandingPage.css";
import {useProductSubscriptionsPage} from "@bat/product-subscription/src/peregrine/lib/talons/ProductSubscriptions/useProductSubscriptionsPage";
import ProductSubscriptionList from './SubscriptionList/productSubscriptionList';
import {GET_STORE_CONFIG} from "../productSubscription.gql";

const ProductSubscriptionPage = (props) => {

    const {
        moduleConfig,
        currency
    } = useProductSubscriptionsPage({
        getStoreConfigQuery: GET_STORE_CONFIG
    });

    const classes = mergeClasses(defaultClasses, props.classes);

    const { formatMessage } = useIntl();

    return (
        <div className={classes.root}>
            <StoreTitle>
                {formatMessage({
                    id: 'accountInformationPage.titleAccount',
                    defaultMessage: 'Product Subscriptions'
                })}
            </StoreTitle>
            <div className={classes.main}>
                <h1 className={classes.title}>
                    <FormattedMessage
                        id={'productSubscriptionPage.pageTitle'}
                        defaultMessage={'Your Subscriptions'}
                    />
                </h1>
                <div className={classes.content}>
                    <ProductSubscriptionList currency={currency} moduleConfig={moduleConfig} />
                </div>
            </div>
        </div>
    )
}

export default ProductSubscriptionPage;
