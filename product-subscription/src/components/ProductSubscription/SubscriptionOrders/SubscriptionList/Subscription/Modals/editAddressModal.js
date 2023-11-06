import React, {useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import { shape, string, bool, array, func, object } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Dialog from '@magento/venia-ui/lib/components/Dialog';
import defaultClasses from '@magento/venia-ui/lib/components/AccountInformationPage/editModal.css';
import {Link, resourceUrl} from '@magento/venia-drivers';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from "@magento/venia-ui/lib/components/TextInput";
import {isRequired} from "@magento/venia-ui/lib/util/formValidators";
import Country from "@magento/venia-ui/lib/components/Country";
import Region from "@magento/venia-ui/lib/components/Region";
import Postcode from "@magento/venia-ui/lib/components/Postcode";
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";

const EditAddressModal = props => {
    const {
        classes: propClasses,
        orderNumber,
        address,
        handleUpdateSubsDeliveryAddress,
        isSubmitting
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);
    const { formatMessage } = useIntl();

    const firstNameLabel = formatMessage({
        id: 'global.firstName',
        defaultMessage: 'First Name'
    });
    const middleNameLabel = formatMessage({
        id: 'global.middleName',
        defaultMessage: 'Middle Name'
    });
    const lastNameLabel = formatMessage({
        id: 'global.lastName',
        defaultMessage: 'Last Name'
    });
    const street1Label = formatMessage({
        id: 'global.streetAddress',
        defaultMessage: 'Street Line 1'
    });
    const street2Label = formatMessage({
        id: 'global.streetAddress2',
        defaultMessage: 'Street Line 2'
    });
    const street3Label = formatMessage({
        id: 'global.streetAddress2',
        defaultMessage: 'Street Line 3'
    });
    const cityLabel = formatMessage({
        id: 'global.city',
        defaultMessage: 'City'
    });
    const telephoneLabel = formatMessage({
        id: 'global.phoneNumber',
        defaultMessage: 'Phone Number'
    });

    const [isOpen, setIsOpen] = useState(false)

    const { street1, street2, street3 } = address;
    let addressInitial = {
        street: [ street1, street2 ? street2 : "", street3 ? street3 : "" ],
        ...address
    }
    const dialogFormProps = {
        initialValues: addressInitial
    };

    const toggleAddressModal = () => {
        setIsOpen(!isOpen);
    }

    const onCancel = () => {
        toggleAddressModal();
    }

    const onSubmit = (formValues) => {
        const postAction = () => {
            setIsOpen(false);
        }
        handleUpdateSubsDeliveryAddress({
            orderNumber,
            postAction,
            ...formValues
        });
    }

    return (
        <div className={classes.root}>
            <Link to={'#'} onClick={toggleAddressModal}
                  className={classes.underlinedLinks}>
                <FormattedMessage
                    id={'productSubscriptionOrderDetailFooter.change'}
                    defaultMessage={'Change'}
                />
            </Link>
            <Dialog
                confirmText={'Save'}
                formProps={dialogFormProps}
                isOpen={isOpen}
                onCancel={onCancel}
                onConfirm={onSubmit}
                shouldUnmountOnHide={true}
                shouldDisableConfirmButton={isSubmitting}
                title={formatMessage({
                    id: 'subscriptionsPage.editDeliveryAddress',
                    defaultMessage: 'Edit Delivery Address'
                })}
                classes={{
                    contents: classes.contents
                }}
            >
                    {/*<FormError*/}
                    {/*    classes={{ root: classes.errorContainer }}*/}
                    {/*    errors={formErrors}*/}
                    {/*/>*/}

                    <div className={classes.firstname}>
                        <Field id="first_name" label={firstNameLabel}>
                            <TextInput field="first_name" validate={isRequired} />
                        </Field>
                    </div>
                    <div className={classes.middlename}>
                        <Field
                            id="middle_name"
                            label={middleNameLabel}
                            optional={true}
                        >
                            <TextInput field="middle_name" />
                        </Field>
                    </div>
                    <div className={classes.lastname}>
                        <Field id="last_name" label={lastNameLabel}>
                            <TextInput field="last_name" validate={isRequired} />
                        </Field>
                    </div>
                    <div className={classes.country}>
                        <Country field={'country'} validate={isRequired} />
                    </div>
                    <div className={classes.street1}>
                        <Field id="street[0]" label={street1Label}>
                            <TextInput field="street[0]" validate={isRequired} />
                        </Field>
                    </div>
                    <div className={classes.street2}>
                        <Field id="street[1]" label={street2Label} optional={true}>
                            <TextInput field="street[1]" />
                        </Field>
                    </div>
                    <div className={classes.street3}>
                        <Field id="street[2]" label={street3Label} optional={true}>
                            <TextInput field="street[2]" />
                        </Field>
                    </div>
                    <div className={classes.city}>
                        <Field id="city" label={cityLabel}>
                            <TextInput field="city" validate={isRequired} />
                        </Field>
                    </div>
                    <div className={classes.region}>
                        <Region
                            countryCodeField={'country'}
                            fieldInput={'region'}
                            fieldSelect={'region[region_id]'}
                            optionValueKey="id"
                            validate={isRequired}
                        />
                    </div>
                    <div className={classes.postcode}>
                        <Postcode validate={isRequired} />
                    </div>
                    <div className={classes.telephone}>
                        <Field id="phone" label={telephoneLabel}>
                            <TextInput field="phone" validate={isRequired} />
                        </Field>
                    </div>
                {isSubmitting ?
                    <LoadingIndicator classes={{root: classes.loadingIndicator}} /> : null
                }
            </Dialog>
        </div>
    );
};

export default EditAddressModal;

EditAddressModal.propTypes = {
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
