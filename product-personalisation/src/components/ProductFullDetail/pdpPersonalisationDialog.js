import React, {Fragment, Suspense} from "react";
import PersonalisationFonts from "./personalisationFonts";
import PersonalisationPanel from "./personalisationPanel";
import {useProductFullDetail} from "../../peregrine/lib/talons/ProductPersonalisation/useProductFullDetail";
import PersonalisationPreview from "./personalisationPreview";
import {
    ADD_CONFIGURABLE_MUTATION,
    ADD_SIMPLE_MUTATION
} from "@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.gql";
import Carousel from "./ImageCarousel/carousel";
import FormError from "@magento/venia-ui/lib/components/FormError";
import {QuantityFields} from "@magento/venia-ui/lib/components/CartPage/ProductListing/quantity";
import Price from "@magento/venia-ui/lib/components/Price";
import Button from "@magento/venia-ui/lib/components/Button";
import {FormattedMessage, useIntl} from "react-intl";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.css";
import pdpPersonalisationDialogClasses from "./pdpPersonalisationDialog.css";
import {isProductConfigurable} from "@magento/peregrine/lib/util/isProductConfigurable";
import {fullPageLoadingIndicator} from "@magento/venia-ui/lib/components/LoadingIndicator";
import Dialog from "@magento/venia-ui/lib/components/Dialog";

const Options = React.lazy(() =>
    import('@magento/venia-ui/lib/components/ProductOptions')
);

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

const PdpPersonalisationDialog = props => {
    const {
        togglePsnVisibility,
        handleTabHeaderClick,
        handleFrontPsnTypeSelect,
        handleOptionSelection,
        skipAreaCustomisation,
        clearAreaSelection,
        psnState,
        psnConfig,
        psnOptions,
        psnProductDetails,
        product
    } = props;

    const classes = mergeClasses(defaultClasses, pdpPersonalisationDialogClasses, props.classes);

    const { formatMessage } = useIntl();

    const productFullDetailTalonProps = useProductFullDetail({
        addConfigurableProductToCartMutation: ADD_CONFIGURABLE_MUTATION,
        addSimpleProductToCartMutation: ADD_SIMPLE_MUTATION,
        product: product,
        psnProductDetails: psnProductDetails,
        togglePsnVisibility
    });

    const {
        errorMessage,
        handleAddToCart,
        handleSelectionChange,
        isAddToCartDisabled,
        mediaGalleryEntries,
        productDetails,
        isMissingOptions
    } = productFullDetailTalonProps;

    const options = isProductConfigurable(product) ? (
        <Suspense fallback={fullPageLoadingIndicator}>
            <Options
                onSelectionChange={handleSelectionChange}
                options={product.configurable_options}
            />
        </Suspense>
    ) : null;

    // Fill a map with field/section -> error.
    const errors = new Map();
    if (errorMessage) {
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
                        id: 'productFullDetail.errorToken',
                        defaultMessage:
                            'There was a problem with your cart. Please sign in again and try adding the item once more.'
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
                        id: 'productFullDetail.errorCart',
                        defaultMessage:
                            'There was a problem with your cart. Please refresh the page and try adding the item once more.'
                    })
                )
            ]);
        }

        // An unknown error should still present a readable message.
        if (!errors.size) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorUnknown',
                        defaultMessage:
                            'Could not add item to cart. Please check required options and try again.'
                    })
                )
            ]);
        }
    }

    return (
        <Fragment>
            <Dialog
                    isOpen={true}
                    onCancel={togglePsnVisibility}
                    shouldShowButtons={false}
                    classes={{
                        dialog: classes.dialog,
                        header: classes.dialog_header,
                        form: classes.form,
                        body: classes.body,
                        contents: classes.contents
                    }}
                    onConfirm={handleAddToCart(psnState)}
                    shouldUnmountOnHide={true}
                >
                    <div className={classes.productFullDetailRoot}>
                        <section className={classes.psnImageCarousel}>
                            <Carousel images={mediaGalleryEntries}
                                      psnState={psnState}
                                      isMissingOptions={isMissingOptions}
                            />
                            <PersonalisationPreview psnState={psnState}/>
                        </section>
                        <FormError
                            classes={{
                                root: classes.formErrors
                            }}
                            errors={errors.get('form') || []}
                        />

                        <PersonalisationFonts
                            psnState={psnState}
                            fonts={psnOptions.fonts}
                        />

                        <PersonalisationPanel
                            cancelPersonalisation={togglePsnVisibility}
                            handleTabHeaderClick={handleTabHeaderClick}
                            handleFrontPsnTypeSelect={handleFrontPsnTypeSelect}
                            handleOptionSelection={handleOptionSelection}
                            skipAreaCustomisation={skipAreaCustomisation}
                            clearAreaSelection={clearAreaSelection}
                            psnState={psnState}
                            psnConfig={psnConfig}
                            psnOptions={psnOptions}
                            psnProductDetails={psnProductDetails}
                            product={product}
                        />

                        <section className={classes.options}>{options}</section>

                        <section className={classes.quantity}>
                            <QuantityFields
                                classes={{ root: classes.quantityRoot }}
                                min={1}
                                message={errors.get('quantity')}
                                label={'Quantity'}
                            />
                        </section>
                        {psnState.activePanel === 2 ?
                            <section className={classes.cartActions}>
                                <div className={classes.price}>
                                    <Price
                                        currencyCode={product.price_range.minimum_price.regular_price.currency}
                                        value={psnState.front.value || psnState.back.value ? Number(psnConfig.price) + Number(productDetails.price.value) : productDetails.price.value}
                                    />
                                </div>
                                <Button
                                    disabled={isAddToCartDisabled || psnState.front.error || psnState.back.error}
                                    priority="high"
                                    type="submit"
                                >
                                    <FormattedMessage
                                        id={'productFullDetail.cartAction'}
                                        defaultMessage={'Add to Cart'}
                                    />
                                </Button>
                            </section> : null
                        }
                    </div>
                </Dialog>
        </Fragment>
    )
}

export default PdpPersonalisationDialog;
