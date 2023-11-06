import React from 'react';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./footer.css";
import Button from '@magento/venia-ui/lib/components/Button';
import {FormattedMessage} from "react-intl";
import EditAddressModal from "../Modals/editAddressModal";
import EditPaymentInformationModal from "../Modals/editPaymentInformationModal";

const ProductSubscriptionListItemFooter = (props) => {
    const {
        subscription,
        handleCancelProductSubscription,
        handleUpdateSubsDeliveryAddress,
        isSubmitting,
        index
    } = props;

    const {
        original_order_number: orderNumber,
        delivery_address: {
            first_name,
            last_name,
            street1,
            street2,
            street3,
            postcode,
            city,
            country,
            phone
        },
        payment_method: {
            card_type,
            card_number
        }
    } = subscription;

    const classes = mergeClasses(defaultClasses, props.classes);

    // const handleChangePaymentMethod = (event) => {
    //     event.preventDefault();
    // }

    return (
        <div className={classes.root}>
            <div>
                <div className={classes.address}>
                    <h4>
                        <FormattedMessage
                            id={'global.deliveryAddress'}
                            defaultMessage={'Delivery Address'}
                        />
                    </h4>
                    <address>
                        {first_name} {last_name}<br/>
                        {street1}{street1 ? <br/> : null}
                        {street2}{street2 ? <br/> : null}
                        {street3}{street3 ? <br/> : null}
                        {postcode} {city}<br/>
                        {country}<br/>
                        Tel: {phone}
                    </address>
                    <EditAddressModal
                        address={subscription.delivery_address}
                        orderNumber={orderNumber}
                        handleUpdateSubsDeliveryAddress={handleUpdateSubsDeliveryAddress}
                        isSubmitting={isSubmitting}
                        classes={{
                            contents: classes.addressModalContent,
                            underlinedLinks: classes.underlinedLinks,
                            loadingIndicator: classes.loadingIndicator
                        }}
                    />
                </div>
                <div className={classes.paymentInfo}>
                    <h4>
                        <FormattedMessage
                            id={'global.paymentInformation'}
                            defaultMessage={'Payment Information'}
                        />
                    </h4>
                    <p>{card_type} {card_number}</p>
                    {/*<EditPaymentInformationModal*/}
                    {/*    subscription={subscription}*/}
                    {/*    classes={{underlinedLinks: classes.underlinedLinks}}*/}
                    {/*/>*/}
                </div>
            </div>
            <div className={classes.buttonWrap}>
                <Button onClick={() => handleCancelProductSubscription(orderNumber, index)}>
                    <FormattedMessage
                        id="productSubscriptionListItem.cancelSubscriptionButtonText"
                        defaultMessage="Cancel Subscription"
                    />
                </Button>
            </div>
        </div>
    )
}

export default ProductSubscriptionListItemFooter;
