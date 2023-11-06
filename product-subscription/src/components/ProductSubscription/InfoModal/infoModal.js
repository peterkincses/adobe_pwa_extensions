import React, {useEffect, useState} from 'react';
import {FormattedMessage, useIntl} from "react-intl";
import Dialog from "@magento/venia-ui/lib/components/Dialog";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./infoModal.css";
import SubscriptionsTableContainer from "../CmsPage/subscriptionsTableContainer";
import {useProductSubscriptionsCms} from "../../../peregrine/lib/talons/ProductSubscriptions/Cms/useProductSubscriptionsCms";
import {GET_STORE_CONFIG} from "../productSubscription.gql";

const ProductSubscriptionInfoModal = (props) => {
    const {
        componentProps
    } = props;

    const {
        errors, loading, tierData, currency, moduleConfig
    } = useProductSubscriptionsCms({
        getStoreConfigQuery: GET_STORE_CONFIG
    });

    const classes = mergeClasses(defaultClasses, props.classes);

    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

    const toggleSubscriptionModalVisibility = (e) => {
        if (e) {
            e.preventDefault();
        }
        setIsSubscriptionModalOpen(!isSubscriptionModalOpen);
    }

    const [toggle, setToggle] = useState(null);
    //this id is set in the pwa-subscription-modal-banner-toggle cms block
    const toggleElement = document.getElementById("subscription-modal-banner-toggle");

    useEffect(() => {
        if (!toggle && toggleElement) {
            setToggle(toggleElement);
            toggleElement.addEventListener("click", toggleSubscriptionModalVisibility);
        }
    }, [toggleElement]);

    return (
        <>
            <p onClick={toggleSubscriptionModalVisibility} id="productInfoModal-trigger" style={{display: "none"}}>
                Toggle subscription info modal
            </p>
            <Dialog
                isOpen={isSubscriptionModalOpen}
                shouldShowButtons={false}
                shouldUnmountOnHide={true}
                onCancel={toggleSubscriptionModalVisibility}
                isModal={false}
                title={''}
                classes={{
                    form: classes.form,
                    dialog: classes.dialog,
                    contents: classes.contents
                }}
            >
                <SubscriptionsTableContainer
                    tierData={tierData}
                    currency={currency}
                    parent="infoModal"
                    toggleSubscriptionModalVisibility={toggleSubscriptionModalVisibility}
                />
            </Dialog>
        </>
    )
}

export default ProductSubscriptionInfoModal;
