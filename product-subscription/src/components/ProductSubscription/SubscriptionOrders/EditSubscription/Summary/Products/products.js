import React, {useCallback, useMemo, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {FormattedMessage, useIntl} from "react-intl";
import Price from "@magento/venia-ui/lib/components/Price";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./products.css";
import Image from "@magento/venia-ui/lib/components/Image";
import PlaceholderImage from "@magento/venia-ui/lib/components/Image/placeholderImage";
import {QuantityFields} from "@magento/venia-ui/lib/components/CartPage/ProductListing/quantity";
//import defaultClasses from '@magento/venia-ui/lib/components/OrderHistoryPage/OrderDetails/item.css';
import {Trash2 as trashIcon, Minus as MinusIcon, Plus as PlusIcon} from 'react-feather';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LinkButton from "@magento/venia-ui/lib/components/LinkButton";
import Quantity from "@magento/venia-ui/lib/components/ProductQuantity";
import TextInput from "@magento/venia-ui/lib/components/TextInput";
import EditSubscriptionSidebarQuantity from "./quantity";
import {Form} from "informed";
import Button from "@magento/venia-ui/lib/components/Button";

const EditSubscriptionSummaryProducts = (props) => {
    const { items, handleDeleteSubscriptionItem } = props;

    const { formatMessage } = useIntl();

    const classes = mergeClasses(defaultClasses, props.classes);

    const handleSubmit = useCallback(
        async formValues => {
            console.log(formValues);
        },[]
    )

    const errors = new Map();

    return (
        <>
            <Form onSubmit={handleSubmit}>
                {items.map((item, index) => {
                    const itemPrice = item.prices.row_total_including_tax.value / item.qty;

                    const [itemState,setItemState] = useState({
                        item
                    })
                    const handleQuantityChange = (qty, item) => {
                        setItemState(prevState => ({
                            ...prevState,
                            item: {
                                ...prevState.item,
                                qty: qty,
                                prices: {
                                    ...prevState.item.prices,
                                    row_total: {
                                        ...prevState.item.prices.row_total,
                                        value: itemPrice * parseInt(qty)
                                    }
                                }
                            }
                        }))
                    }
                    const {product} = itemState.item;

                    // const mappedOptions = useMemo(
                    //     () =>
                    //         product.selected_options.map(option => ({
                    //             option_label: option.label,
                    //             value_label: option.value
                    //         })),
                    //     [product.selected_options]
                    // );

                    return <div className={classes.root} key={'subscription-order-product-'+index}>
                        <div className={classes.productInfoContainer}>
                            <div className={classes.nameContainer}>
                                <p>{product.name}</p>
                            </div>
                            {/*<ProductOptions*/}
                            {/*    options={mappedOptions}*/}
                            {/*    classes={{*/}
                            {/*        options: classes.options*/}
                            {/*    }}*/}
                            {/*/>*/}
                        </div>

                        <div className={classes.quantity}>
                            <EditSubscriptionSidebarQuantity
                                product={product}
                                item={item}
                                index={index}
                                initialValue={item.qty}
                                onChange={(qty) => handleQuantityChange(qty, item)}
                                min="5"
                            />
                        </div>

                        <div className={classes.price}>
                            {/*@todo: get currency data*/}
                            <Price currencyCode={"GBP"} value={itemState.item.prices.row_total_including_tax.value} />
                        </div>
                        <div className={classes.deleteColumn}>
                            <LinkButton onClick={() => handleDeleteSubscriptionItem(item.subscription_id)}>
                                <Icon src={trashIcon} size={20} />
                            </LinkButton>
                        </div>
                    </div>
                })}
            </Form>
        </>
    )
}

export default EditSubscriptionSummaryProducts;
