import React, {useCallback, useMemo, useEffect, useState} from 'react';
import {FormattedMessage, useIntl} from "react-intl";
import Price from "@magento/venia-ui/lib/components/Price";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./summary.css";
import productClasses from "./Products/products.css";
import {Trash2 as trashIcon, Minus as MinusIcon, Plus as PlusIcon} from 'react-feather';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LinkButton from "@magento/venia-ui/lib/components/LinkButton";
import TextInput from "@magento/venia-ui/lib/components/TextInput";
import EditSubscriptionSidebarQuantity from "./Products/quantity";
import {Form} from "informed";
import Button from "@magento/venia-ui/lib/components/Button";
import EditSubscriptionSummaryHeading from "./summaryHeading";
import EditSubscriptionSummaryTotals from "./totals";
import {PRODUCT_SUBSCRIPTION_DISCOUNT_TYPE} from "../../../../../peregrine/lib/talons/ProductSubscriptions/Edit/useEditProductSubscription";

const EditSubscriptionSummary = (props) => {
    const {
        handleDeleteSubscriptionItem,
        handleUpdateSubscriptionSummaryQuantities,
        handleQuantityChange,
        subscriptionState,
        showUpdateButton,
        currency
    } = props;

    const classes = mergeClasses(defaultClasses, productClasses, props.classes);
    const errors = new Map();

    return (
        <>
            <div className={classes.root}>
                <Form onSubmit={handleUpdateSubscriptionSummaryQuantities}>
                    <EditSubscriptionSummaryHeading
                        subscriptionState={subscriptionState}
                    />

                    <div className={classes.sidebarContent}>
                        {subscriptionState.items.map((item, index) => {
                                const {product} = item;
                                const itemPrice = item.prices.row_total_including_tax.value;
                                let itemWithDiscount;
                                if (PRODUCT_SUBSCRIPTION_DISCOUNT_TYPE === 'percentage') {
                                    itemWithDiscount = item.prices.discounts ? itemPrice * ((100 - item.prices.discounts)/100) : null;
                                } else {
                                    itemWithDiscount = item.prices.discounts ? itemPrice - item.prices.discounts : null;
                                }

                                return <div className={classes.summaryProduct} key={'subscription-order-product-'+index}>
                                    <div className={classes.productInfoContainer}>
                                        <div className={classes.nameContainer}>
                                            <p>{product.name}</p>
                                        </div>
                                        <div className={classes.hidden}>
                                            <TextInput field={'subscription_id['+index+']'}
                                                       initialValue={item.subscription_id}
                                            />
                                        </div>
                                    </div>

                                    <div className={classes.quantity}>
                                        <EditSubscriptionSidebarQuantity
                                            product={product}
                                            item={item}
                                            index={index}
                                            initialValue={item.qty}
                                            onChange={(qty) => handleQuantityChange(qty, index, itemPrice)}
                                            min="1"
                                        />
                                    </div>

                                    <div className={classes.price}>
                                        {currency ?
                                            <>
                                            {itemWithDiscount ?
                                                <>
                                                    <span className={classes.regularPrice}>
                                                        <Price currencyCode={currency} value={itemPrice} />
                                                    </span>
                                                    <span className={classes.discountPrice}>
                                                        <Price currencyCode={currency} value={itemWithDiscount} />
                                                    </span>
                                                </>
                                                :
                                                <Price currencyCode={currency} value={itemPrice} />
                                            }
                                            </>
                                            : null
                                        }
                                    </div>
                                    <div className={classes.deleteColumn}>
                                        <LinkButton onClick={handleDeleteSubscriptionItem(item.subscription_id)}>
                                            <Icon src={trashIcon} size={20} />
                                        </LinkButton>
                                    </div>
                                </div>
                            })}
                    </div>
                    <EditSubscriptionSummaryTotals
                        subscriptionState={subscriptionState}
                        currency={currency}
                    />
                    {showUpdateButton ?
                        <section className={classes.cartActions}>
                            <Button
                                priority="high"
                                type="submit">
                                <FormattedMessage
                                    id={'editSubscriptionSummary.submitButtonText'}
                                    defaultMessage={'Update Subscription'}
                                />
                            </Button>
                        </section> : null
                    }
                </Form>
            </div>
        </>
    )
}

export default EditSubscriptionSummary;
