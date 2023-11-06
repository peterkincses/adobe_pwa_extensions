import React from 'react';
import {useEditProductSubscription} from "../../../../peregrine/lib/talons/ProductSubscriptions/Edit/useEditProductSubscription";
import {
    GET_ALL_SUBSCRIPTION_PRODUCTS,
    GET_CUSTOMER_PRODUCT_SUBSCRIPTIONS,
    GET_STORE_CONFIG,
    UPDATE_PRODUCT_SUBSCRIPTION_ITEMS
} from "../../productSubscription.gql";
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";
import {FormattedMessage} from "react-intl";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from './editSubscription.css';
import EditSubscriptionPageProduct from "./Products/product";
import EditSubscriptionSummary from "./Summary/summary";

const EditSubscription = (props) => {

    const classes = mergeClasses(defaultClasses, props.classes);

    const {
        errorMessage,
        loading,
        handleDeleteSubscriptionItem,
        handleUpdateSubscriptionSummaryQuantities,
        handleAddNewSubscriptionItems,
        handleQuantityChange,
        subscription,
        subscriptionState,
        allSubscriptionProducts,
        isSubmitting,
        showUpdateButton,
        currency,
        totalQty
    } = useEditProductSubscription({
        getAllSubscriptionProducts: GET_ALL_SUBSCRIPTION_PRODUCTS,
        getCustomerProductSubscriptionsQuery: GET_CUSTOMER_PRODUCT_SUBSCRIPTIONS,
        getStoreConfigQuery: GET_STORE_CONFIG,
        updateProductSubscriptionItemsMutation: UPDATE_PRODUCT_SUBSCRIPTION_ITEMS
    });

    return subscription ?
        <div className={classes.root}>
            <h1 className={classes.pageTitle}>
                Modify your subscription ({subscription.original_order_number})
            </h1>
            <p>Select the flavours and strengths you'd like to receive each month as part of your subscription.</p>

            {errorMessage ? <div className={classes.errorText}>{errorMessage}</div> : null }

            <div className={classes.editContent}>
                <div className={classes.editMain}>
                    {allSubscriptionProducts ?
                        <div className={classes.productGrid}>
                            {allSubscriptionProducts.map((product, index) => {
                                return <EditSubscriptionPageProduct key={'edit-subscription-page-products' +index}
                                                                    product={product}
                                                                    handleAddNewSubscriptionItems={handleAddNewSubscriptionItems}
                                                                    subscriptionState={subscriptionState}
                                       />
                            })}
                        </div>
                        : null
                    }
                </div>
                <EditSubscriptionSummary
                    subscriptionState={subscriptionState}
                    handleDeleteSubscriptionItem={handleDeleteSubscriptionItem}
                    handleUpdateSubscriptionSummaryQuantities={handleUpdateSubscriptionSummaryQuantities}
                    handleQuantityChange={handleQuantityChange}
                    showUpdateButton={showUpdateButton}
                    currency={currency}
                    totalQty={totalQty}
                    classes={{
                        root: classes.editSidebar
                    }}
                />
            </div>
            {loading || isSubmitting ?
                <LoadingIndicator classes={{root: classes.loadingIndicator}}>
                    {loading && !isSubmitting ?
                        <FormattedMessage
                            id={'editProductSubscriptions.loadingSubscriptionMessage'}
                            defaultMessage={'Loading subscription details...'}
                        /> : null
                    }
                    {isSubmitting && !loading ?
                        <FormattedMessage
                            id={'editProductSubscriptions.updateSubscriptionMessage'}
                            defaultMessage={'Updating subscription details...'}
                        /> : null
                    }
                </LoadingIndicator>
            : null
            }
        </div>
        :
        <div className={classes.root}>
            <h3>
                <FormattedMessage
                    id={'editProductSubscriptions.noSubscriptionFoundMessage'}
                    defaultMessage={'We could not find this subscription'}
                />
            </h3>
        </div>

}

export default EditSubscription;
