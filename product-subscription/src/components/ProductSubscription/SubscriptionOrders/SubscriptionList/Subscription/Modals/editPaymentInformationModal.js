import React, {useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import { shape, string, bool, array, func, object } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
// import EditForm from './editForm';
import FormError from '@magento/venia-ui/lib/components/FormError';
import Dialog from '@magento/venia-ui/lib/components/Dialog';
import defaultClasses from '@magento/venia-ui/lib/components/AccountInformationPage/editModal.css';
import {Link, resourceUrl} from '@magento/venia-drivers';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from "@magento/venia-ui/lib/components/TextInput";
import {isRequired} from "@magento/venia-ui/lib/util/formValidators";
import Country from "@magento/venia-ui/lib/components/Country";
import Region from "@magento/venia-ui/lib/components/Region";
import Postcode from "@magento/venia-ui/lib/components/Postcode";
import Checkbox from "@magento/venia-ui/lib/components/Checkbox";

const EditPaymentInformationModal = props => {
    const {
        classes: propClasses,
        formErrors,
        // onCancel,
        // onSubmit,
        initialValues,
        subscription,
        isDisabled,
        handleChangeProcessingDate
    } = props;

    const [formAddress, setFormAddress] = useState(null);

    const formProps = {
        initialValues: formAddress
    };

    const { formatMessage } = useIntl();

    const [isOpen, setIsOpen] = useState(false)

    const classes = mergeClasses(defaultClasses, propClasses);

    const dialogFormProps = { initialValues };

    const toggleModal = () => {
        setIsOpen(!isOpen);
    }

    const onCancel = () => {
        toggleModal();
    }

    const onSubmit = (date) => {
        toggleModal();
        //handleChangeProcessingDate(date);
    }

    const cardTypeLabel = formatMessage({
        id: 'subscription.cardType',
        defaultMessage: 'Card Type'
    });

    return (
        <>
            <Link to={'#'} onClick={toggleModal}
                  className={classes.underlinedLinks}>
                <FormattedMessage
                    id={'productSubscriptionListSubscription.change'}
                    defaultMessage={'Change'}
                />
            </Link>
            <Dialog
                classes={{ body: classes.bodyEditSubscriptionDeliveryAddress }}
                confirmText={'Save'}
                // formProps={dialogFormProps}
                isOpen={isOpen}
                onCancel={onCancel}
                onConfirm={onSubmit}
                // shouldDisableAllButtons={isDisabled}
                // shouldDisableConfirmButton={isDisabled}
                shouldUnmountOnHide={true}
                title={formatMessage({
                    id: 'subscriptionPaymentMethodModal.modalTitle',
                    defaultMessage: 'Update Payment Information'
                })}
            >
                {/*<FormError*/}
                {/*    classes={{ root: classes.errorContainer }}*/}
                {/*    errors={formErrors}*/}
                {/*/>*/}
                <div className={classes.root}>
                    <div className={classes.telephone}>
                        <Field id="card_type" label={formatMessage({
                            id: 'subscription.cardType',
                            defaultMessage: 'Card Type'
                        })}>
                            <TextInput
                                field="card_type"
                                validate={isRequired}
                                initialValue={subscription.payment_method.card_type}
                            />
                        </Field>
                        <Field id="card_number" label={
                            formatMessage({
                                id: 'subscription.cardNumber',
                                defaultMessage: 'Card Number'
                            })
                        }>
                            <TextInput
                                field="card_number"
                                validate={isRequired}
                                initialValue={subscription.payment_method.card_number}
                            />
                        </Field>
                        <Field id="expiry" label={
                            formatMessage({
                                id: 'subscription.expiry',
                                defaultMessage: 'Expiry Date'
                            })
                        }>
                            <TextInput
                                field="expiry"
                                validate={isRequired}
                                initialValue={subscription.payment_method.expiry}
                            />
                        </Field>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default EditPaymentInformationModal;

EditPaymentInformationModal.propTypes = {
    classes: shape({
        errorContainer: string
    }),
    formErrors: array,
    handleCancel: func,
    handleSubmit: func,
    initialValues: object,
    isDisabled: bool,
    isOpen: bool
};
