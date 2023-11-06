import React from 'react';
import ProductSubscriptionListItem from "./Subscription";
import {
    GET_CUSTOMER_PRODUCT_SUBSCRIPTIONS
} from "../../productSubscription.gql";
import {useProductSubscriptionsList} from "../../../../peregrine/lib/talons/ProductSubscriptions/useProductSubscriptionsList";
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";
import {FormattedMessage} from "react-intl";
import Button from "@magento/venia-ui/lib/components/Button";
import {useHistory} from "react-router-dom";

const ProductSubscriptionList = (props) => {
    const {currency, moduleConfig} = props;
    const {
        subscriptions,
        loading,
        error,
        refetchSubscriptionList,
        setSubscriptionListState
    } = useProductSubscriptionsList({
        getCustomerProductSubscriptionsQuery: GET_CUSTOMER_PRODUCT_SUBSCRIPTIONS
    });

    const history = useHistory();

    const startShopping = () => {
        history.push('/')
    }

    if (loading) {
        return (
            <LoadingIndicator>
                <FormattedMessage
                    id={'productSubscriptions.loading'}
                    defaultMessage={'Loading subscriptions...'}
                />
            </LoadingIndicator>
        );
    }

    if (error) {
        console.log(error);
        return (
            <>
                <p>
                    <FormattedMessage
                        id={'productSubscriptionList.errorMessage'}
                        defaultMessage={"We are sorry, something has gone wrong with your request. Please refresh the page or contact us."}
                    />
                </p>
                <Button
                    onClick={startShopping}
                    priority="high"
                >
                    <FormattedMessage
                        id={'productSubscriptionList.contactUs'}
                        defaultMessage={'Contact us'}
                    />
                </Button>
            </>

        )
    }

    if (!subscriptions || !subscriptions.length) {
        return <div>
            <p>
                <FormattedMessage
                    id={'productSubscriptionList.emptyDataMessage'}
                    defaultMessage={"You don't have any subscriptions."}
                />
            </p>
            <Button
                onClick={startShopping}
                priority="high"
            >
                <FormattedMessage
                    id={'productSubscriptionList.startShopping'}
                    defaultMessage={'Start Shopping'}
                />
            </Button>
        </div>
    }

    return (
        <>
            {subscriptions.map((subscription, index) => {
                return <ProductSubscriptionListItem
                           moduleConfig={moduleConfig}
                           currency={currency}
                           index={index}
                           key={'productSubscriptionList-item-'+ index}
                           refetchSubscriptionList={refetchSubscriptionList}
                           setSubscriptionListState={setSubscriptionListState}
                           subscription={subscription}
                           subscriptions={subscriptions}
                       />
            })}
        </>
    )
}

export default ProductSubscriptionList;
