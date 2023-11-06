import React, {useState} from 'react';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./subscription.css";
import Button from '@magento/venia-ui/lib/components/Button';
import {FormattedMessage} from "react-intl";
import ProductSubscriptionListItemHeader from './Header';
import SubscriptionOrderProducts from "./Products";
import ProductSubscriptionListItemFooter from "./Footer";
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";
import EditNextDeliveryDateModal from "./Modals/editNextDeliveryDateModal";
import {useProductSubscriptionsListItem} from "../../../../../peregrine/lib/talons/ProductSubscriptions/useProductSubscriptionsListItem";
import {
    CANCEL_PRODUCT_SUBSCRIPTION,
    PAUSE_PRODUCT_SUBSCRIPTION,
    RESUME_PRODUCT_SUBSCRIPTION,
    SKIP_NEXT_SUBSCRIPTION_DELIVERY,
    UPDATE_PRODUCT_SUBSCRIPTION_NEXT_ORDER_DATE,
    UPDATE_SUBS_DELIVERY_ADDRESS
} from "../../../productSubscription.gql";
import FormError from "@magento/venia-ui/lib/components/FormError";
import {useHistory} from "react-router-dom";

const ProductSubscriptionListItem = (props) => {
    const {
        moduleConfig,
        currency,
        subscription,
        subscriptions,
        refetchSubscriptionList,
        setSubscriptionListState,
        index
    } = props;

    const {
        handleSkipNextDelivery,
        handlePauseProductSubscription,
        handleResumeProductSubscription,
        handleCancelProductSubscription,
        handleUpdateSubsDeliveryAddress,
        handleUpdateSubsNextDeliveryDate,
        subscriptionOrderItemErrors,
        isSubmitting
    } = useProductSubscriptionsListItem({
        skipNextSubscriptionDeliveryMutation: SKIP_NEXT_SUBSCRIPTION_DELIVERY,
        pauseSubscriptionDeliveryMutation: PAUSE_PRODUCT_SUBSCRIPTION,
        resumeSubscriptionDeliveryMutation: RESUME_PRODUCT_SUBSCRIPTION,
        cancelSubscriptionDeliveryMutation: CANCEL_PRODUCT_SUBSCRIPTION,
        updateSubsDeliveryAddressMutation: UPDATE_SUBS_DELIVERY_ADDRESS,
        updateSubsNextDeliveryDateMutation: UPDATE_PRODUCT_SUBSCRIPTION_NEXT_ORDER_DATE,
        refetchSubscriptionList,
        subscriptions,
        setSubscriptionListState
    });

    const {
        original_order_number,
        status,
        items,
        subscription_dates: {
            next_order_date,
            user_editable_by_date
        }
    } = subscription;

    const classes = mergeClasses(defaultClasses, props.classes);

    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    }

    const history = useHistory();
    const editSubscription = () => {
        history.push('/product-subscription/edit/' + original_order_number)
    , [history]}

    const editableBy = new Date(user_editable_by_date).toLocaleString();

    return (
        <div className={classes.root}>
            <FormError
                classes={{ root: classes.errorContainer }}
                errors={Array.from(subscriptionOrderItemErrors.values())}
            />
            <ProductSubscriptionListItemHeader
                moduleConfig={moduleConfig}
                subscription={subscription}
                isOpen={isOpen}
                handleToggle={handleToggle}
            />
            <div className={isOpen ? classes.body: classes.bodyClosed}>
                <div className={classes.summary}>
                    <div>
                        <h4>
                            <FormattedMessage
                                id={'productSubscription.yourNextDelivery'}
                                defaultMessage={'Your next delivery'}
                            />
                        </h4>
                        <div>
                            <span className={classes.nextProcessingDate}>
                                <FormattedMessage
                                    id={'productSubscription.nextDeliveryEstimate'}
                                    defaultMessage={'Estimated next processing date:'}
                                />
                                <span className={classes.date}>{next_order_date}</span>
                            </span>
                            <EditNextDeliveryDateModal
                                handleUpdateSubsNextDeliveryDate={handleUpdateSubsNextDeliveryDate}
                                originalOrderNumber={original_order_number}
                                nextOrderDate={next_order_date}
                                classes={{underlinedLinks: classes.underlinedLinks}}
                                index={index}
                            />
                        </div>
                        <div className={classes.changeNote}>
                            <FormattedMessage
                                    id={'productSubscription.userEditableByDate'}
                                    defaultMessage={'Changes can be made up to:'}
                            />
                            <span className={classes.editableBy}>
                                {editableBy}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className={classes.summaryButtons}>
                            <Button priority="normal" type="button" onClick={() => handleSkipNextDelivery(original_order_number, index)}>
                                <FormattedMessage
                                    id={'productSubscription.skipNextDelivery'}
                                    defaultMessage={'Skip Next Delivery'}
                                />
                            </Button>
                            {status === 'Active' ?
                                <Button priority="normal" type="button" onClick={() => handlePauseProductSubscription(original_order_number, index)}>
                                    <FormattedMessage
                                        id={'productSubscription.pauseSubscription'}
                                        defaultMessage={'Pause Subscription'}
                                    />
                                </Button> : null
                            }
                            {status === 'Paused' ?
                                <Button priority="normal" type="button" onClick={() => handleResumeProductSubscription(original_order_number, index)}>
                                    <FormattedMessage
                                        id={'productSubscription.resumeSubscription'}
                                        defaultMessage={'Resume Subscription'}
                                    />
                                </Button> : null
                            }
                        </div>
                    </div>
                </div>
                <div className={classes.subscriptionItemTable}>
                    <h4>
                        <FormattedMessage
                            id={'productSubscription.productsHeadingLabel'}
                            defaultMessage={'This subscription includes:'}
                        />
                    </h4>
                    <SubscriptionOrderProducts
                        subscription={subscription}
                        items={items}
                        currency={currency} />
                    <p>
                        <Button
                            onClick={editSubscription}
                            priority="high"
                        >
                            <FormattedMessage
                                id={'productSubscriptionOrderListItem.editSubscription'}
                                defaultMessage={'Edit your subscription'}
                            />
                        </Button>
                    </p>
                </div>
                <ProductSubscriptionListItemFooter
                    subscription={subscription}
                    handleCancelProductSubscription={handleCancelProductSubscription}
                    handleUpdateSubsDeliveryAddress={handleUpdateSubsDeliveryAddress}
                    isSubmitting={isSubmitting}
                    classes={{underlinedLinks: classes.underlinedLinks}}
                    index={index}
                />
                {isSubmitting ? <LoadingIndicator classes={{root: classes.loadingIndicator}} /> : null}
            </div>
        </div>
    )
}

export default ProductSubscriptionListItem;
