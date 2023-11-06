import React, {Suspense} from "react";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "../../../../../../../../components/Gallery/item.css";
import productClasses from "./product.css";
import {Form} from "informed";
import Image from "@magento/venia-ui/lib/components/Image";
import Price from "@magento/venia-ui/lib/components/Price";
import FormError from "@magento/venia-ui/lib/components/FormError";
import {FormattedMessage, useIntl} from "react-intl";
import {QuantityFields} from "@magento/venia-ui/lib/components/CartPage/ProductListing/quantity";
import Button from "@magento/venia-ui/lib/components/Button";
import { Link, resourceUrl } from '@magento/venia-drivers';
import {UNCONSTRAINED_SIZE_KEY} from "@magento/peregrine/lib/talons/Image/useImage";
import {isProductConfigurable} from "@magento/peregrine/lib/util/isProductConfigurable";
import {fullPageLoadingIndicator} from "@magento/venia-ui/lib/components/LoadingIndicator";
import {useEditProductSubscriptionProduct} from "../../../../../peregrine/lib/talons/ProductSubscriptions/Edit/useEditProductSubscriptionProduct";
import {UPDATE_PRODUCT_SUBSCRIPTION_ITEMS} from "../../../productSubscription.gql";
const Options = React.lazy(() =>
    import('@magento/venia-ui/lib/components/ProductOptions')
);

const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 200;

// Gallery switches from two columns to three at 640px.
const IMAGE_WIDTHS = new Map()
    .set(640, IMAGE_WIDTH)
    .set(UNCONSTRAINED_SIZE_KEY, 300);

// Correlate a GQL error message to a field. GQL could return a longer error
// string but it may contain contextual info such as product id. We can use
// parts of the string to check for which field to apply the error.
const ERROR_MESSAGE_TO_FIELD_MAPPING = {
    'The requested qty is not available': 'quantity',
    'Product that you are trying to add is not available.': 'quantity',
    "The product that was requested doesn't exist.": 'quantity'
};

// Field level error messages for rendering.
const ERROR_FIELD_TO_MESSAGE_MAPPING = {
    quantity: 'The requested quantity is not available.'
};

const SUPPORTED_PRODUCT_TYPES = ['SimpleProduct', 'ConfigurableProduct'];
const INITIAL_OPTION_CODES = new Map();
const INITIAL_OPTION_SELECTIONS = new Map();


const EditSubscriptionPageProduct = (props) => {
    const {
        product,
        handleAddNewSubscriptionItems,
        setIsSubmitting,
        subscriptionState
    } = props;

    const {
        handleAddToSubscription,
        handleSelectionChange,
        errorMessage,
        isAddToSubscriptionDisabled
    } = useEditProductSubscriptionProduct({
        handleAddToSubscriptionMutation: UPDATE_PRODUCT_SUBSCRIPTION_ITEMS,
        product,
        handleAddNewSubscriptionItems,
        subscriptionState
    });

    const classes = mergeClasses(defaultClasses, productClasses, props.classes);

    const { formatMessage } = useIntl();

    const options = isProductConfigurable(product) ? (
        <Suspense fallback={fullPageLoadingIndicator}>
            <Options
                onSelectionChange={handleSelectionChange}
                options={product.configurable_options}
                classes={{
                    root: classes.options
                }}
            />
        </Suspense>
    ) : null;

    const urlKey = product.url_key ? product.url_key : product.canonical_url;
    const productLink = resourceUrl(`/${urlKey}${product.url_suffix || ''}`);

    // Fill a map with field/section -> error.
    const errors = new Map();
    if (errorMessage) {
        console.log(errorMessage);
        Object.keys(ERROR_MESSAGE_TO_FIELD_MAPPING).forEach(key => {
            if (errorMessage.includes(key)) {
                const target = ERROR_MESSAGE_TO_FIELD_MAPPING[key];
                const message = ERROR_FIELD_TO_MESSAGE_MAPPING[target];
                errors.set(target, message);
            }
        });

        // Handle cases where a user token is invalid or expired. Preferably
        // this would be handled elsewhere with an error code and not a string.
        if (errorMessage.includes('The current user cannot')) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'editSubscriptionPageProduct.errorToken',
                        defaultMessage:
                            'There was a problem with your subscription. Please sign in again and try adding the item once more.'
                    })
                )
            ]);
        }

        if (errorMessage.includes('is already in the subscription')) {
            errors.set('form', [
                new Error(errorMessage)
            ]);
        }

        if (errorMessage.includes('out of stock')) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'editSubscriptionPageProduct.outOfStock',
                        defaultMessage:
                            'This product is out of stock'
                    })
                )
            ]);
        }

        // Handle cases where a cart wasn't created properly.
        if (
            errorMessage.includes('Variable "$cartId" got invalid value null')
        ) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'editSubscriptionPageProduct.errorCart',
                        defaultMessage:
                            'There was a problem with your subscription. Please refresh the page and try adding the item once more.'
                    })
                )
            ]);
        }

        // An unknown error should still present a readable message.
        if (!errors.size) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'editSubscriptionPageProduct.errorUnknown',
                        defaultMessage:
                            'Could not add item to subscription. Please check required options and try again.'
                    })
                )
            ]);
        }
    }

    return (
        <div className={classes.root}>
            <Form onSubmit={handleAddToSubscription}>
                <Link
                    // onClick={handleLinkClick}
                    to={productLink}
                    className={classes.imageLink}
                >
                    <Image
                        alt={product.name}
                        classes={{
                            image: classes.image,
                            root: classes.imageContainer
                        }}
                        style={{height: "auto"}}
                        height={IMAGE_HEIGHT}
                        resource={product.small_image.url}
                        widths={IMAGE_WIDTHS}
                    />
                </Link>
                <section className={classes.title}>
                    <Link
                        // onClick={handleLinkClick}
                        to={productLink}
                        className={classes.productName}
                    >
                        <span>{product.name}</span>
                    </Link>
                    <p className={classes.productPrice}>
                        <Price
                            currencyCode={product.price_range.minimum_price.regular_price.currency}
                            value={product.price_range.minimum_price.regular_price.value}
                        />
                    </p>
                </section>
                <FormError
                    classes={{
                        root: classes.formErrors
                    }}
                    errors={errors.get('form') || []}
                />
                <section className={classes.options}>{options}</section>
                <section className={classes.quantity}>
                    <label className={classes.quantityTitle}>
                        <FormattedMessage
                            id={'global.quantity'}
                            defaultMessage={'Quantity'}
                        />
                    </label>
                    <p>{product.qty}</p>
                    <QuantityFields
                        classes={{ root: classes.quantityRoot }}
                        min={1}
                        max={30}
                        message={errors.get('quantity')}
                    />
                </section>
                <section className={classes.cartActions}>
                    <Button
                        disabled={isAddToSubscriptionDisabled}
                        priority="high"
                        type="submit"
                    >
                        <FormattedMessage
                            id={'editSubscriptionPageProduct.cartAction'}
                            defaultMessage={'Add to Subscription'}
                        />
                    </Button>
                </section>
            </Form>
        </div>
    )
}

export default EditSubscriptionPageProduct;
