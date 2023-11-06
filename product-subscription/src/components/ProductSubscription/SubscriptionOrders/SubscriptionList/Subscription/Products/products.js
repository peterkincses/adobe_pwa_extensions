import React from 'react';
import {FormattedMessage} from "react-intl";
import Price from "@magento/venia-ui/lib/components/Price";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import productClasses from "./products.css";
import Image from "@magento/venia-ui/lib/components/Image";
import PlaceholderImage from "@magento/venia-ui/lib/components/Image/placeholderImage";
import defaultClasses from '@magento/venia-ui/lib/components/OrderHistoryPage/OrderDetails/item.css';

const SubscriptionOrderProducts = (props) => {
    const {
        items,
        currency
    } = props;

    const classes = mergeClasses(defaultClasses, productClasses, props.classes);

    const product_name = 'Product name';
    const thumbnailProps = {
        alt: product_name,
        classes: { root: classes.thumbnail },
        width: 100
    };

    return (
        <>
            {items.map((item, index) => {
                const {product} = item;

                const thumbnailElement = product.thumbnail ? (
                    <Image {...thumbnailProps} resource={product.thumbnail.url} />
                ) : (
                    <PlaceholderImage {...thumbnailProps} />
                );

                return <div className={classes.root} key={'subscription-order-product-'+index}>
                    <div className={classes.thumbnailContainer}>
                        {thumbnailElement}
                    </div>
                    <div className={classes.productInfoContainer}>
                        <div className={classes.nameContainer}>
                            {product.name}
                        </div>
                    </div>
                    <span className={classes.quantity}>
                        <FormattedMessage
                            id="orderDetails.quantity"
                            defaultMessage="Qty: {quantity}"
                            values={{
                                quantity: item.qty
                            }}
                        />
                    </span>
                    <div className={classes.price}>
                        {currency ?
                            <>
                                <div className={item.prices.discounts ? classes.originalPrice : null}>
                                    <Price currencyCode={currency}
                                           value={item.prices.row_total_including_tax.value}
                                    />
                                </div>
                                {item.prices.discounts ?
                                    <div>
                                        <Price currencyCode={currency}
                                               value={item.prices.row_total_including_tax.value - item.prices.discounts[0].amount.value}
                                        />
                                    </div> : null
                                }
                            </>
                            : null
                        }
                    </div>
                </div>
            })}
        </>
    )
}

export default SubscriptionOrderProducts;
