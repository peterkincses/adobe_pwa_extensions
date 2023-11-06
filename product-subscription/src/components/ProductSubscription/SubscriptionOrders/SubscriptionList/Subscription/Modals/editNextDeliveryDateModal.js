import React, {useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import { shape, string, bool, array, func, object } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Dialog from '@magento/venia-ui/lib/components/Dialog';
import {Link} from '@magento/venia-drivers';
import Field from '@magento/venia-ui/lib/components/Field';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import defaultClasses from './editNextDeliveryDateModal.css';

const EditNextDeliveryDateModal = props => {
    const {
        classes: propClasses,
        formErrors,
        // onCancel,
        // onSubmit,
        // initialValues,
        isDisabled,
        originalOrderNumber,
        nextOrderDate: nextOrderDateStr,
        handleUpdateSubsNextDeliveryDate,
        index
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);
    const { formatMessage } = useIntl();

    const [isOpen, setIsOpen] = useState(false);
    const [isConfirmDisabled, setIsConfirmDisabled] = useState(isDisabled);

    const nextOrderDayDelay = 2; // @todo: should go in graphql
    const nextOrderDateCurrent = new Date(nextOrderDateStr);
    const nextOrderDateAllowed = new Date(new Date().setDate(new Date().getDate() + nextOrderDayDelay))
    const [nextOrderDateSelected, setNextOrderDateSelected] = useState(nextOrderDateCurrent);

    const initialValues = {
        date: nextOrderDateCurrent
    }

    const dialogFormProps = {
        initialValues
    };

    const toggleModal = () => {
        setIsOpen(!isOpen);
    }

    const onCancel = () => {
        toggleModal();
    }

    const onConfirm = (formValues) => {
        toggleModal();
        handleUpdateSubsNextDeliveryDate({
            original_order_number: originalOrderNumber,
            date: nextOrderDateSelected
        }, index);
    }

    const dateLabel = formatMessage({
        id: 'subscription.nextProcessingDate',
        defaultMessage: 'Next Processing Date'
    });

    const [datePickerError, setDatePickerError] = useState(null);

    const handleDatePickerChange = (date) => {
        if (nextOrderDateAllowed >= date) {
            const notInFuture = formatMessage({
                id: 'subscription.notInFuture',
                defaultMessage: 'You can only select a date which is at least %0 days after today.'.replace('%0', nextOrderDayDelay)
            });
            setDatePickerError(notInFuture);
            setIsConfirmDisabled(true);
        } else {
            setDatePickerError(null);
            setIsConfirmDisabled(false);
            setNextOrderDateSelected(date);
        }
    }

    return (
        <>
            <Link to={'#'} onClick={toggleModal} className={classes.underlinedLinks}>
                <FormattedMessage
                    id={'productSubscriptionListSubscription.change'}
                    defaultMessage={'Change'}
                />
            </Link>
            <Dialog
                classes={{
                    dialog: classes.dialog,
                    buttons: classes.buttons,
                    contents: classes.contents
                }}
                confirmText={'Save'}
                formProps={dialogFormProps}
                isOpen={isOpen}
                onCancel={onCancel}
                onConfirm={onConfirm}
                shouldDisableConfirmButton={isConfirmDisabled}
                shouldUnmountOnHide={true}
                title={""}
            >
                <div className={classes.root}>
                    <div className={classes.date}>
                        <div className={classes.datepickerWrap}>
                        </div>
                        <Field id="date" label={dateLabel}>
                            <DatePicker selected={nextOrderDateSelected} onChange={(date) => handleDatePickerChange(date)} />
                            {datePickerError ?
                                <p className={classes.errorMsg}>{datePickerError}</p> : null
                            }
                        </Field>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default EditNextDeliveryDateModal;

EditNextDeliveryDateModal.propTypes = {
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
