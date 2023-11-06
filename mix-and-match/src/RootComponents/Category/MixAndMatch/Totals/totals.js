import React from 'react';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from './totals.css';
import {FormattedMessage} from "react-intl";
import Button from "@magento/venia-ui/lib/components/Button";
import Price from "@magento/venia-ui/lib/components/Price";

const MixAndMatchTotals = (props) => {
    const {
        currency,
        handleAddSetToCart,
        isAddingToCart
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    const {
        totals: {
            items,
            subTotal
        }
    } = props;

    if (!items || !items.length) return null;

    const CTA = <Button
        priority={'high'}
        classes={{ root_highPriority: classes.button }}
        onClick={handleAddSetToCart}
        type="button"
        disabled={isAddingToCart}
    >
        {isAddingToCart ?
            <FormattedMessage
                id={'addToCart.adding'}
                defaultMessage={'Adding...'}
            />
            :
            <FormattedMessage
                id={'addToCart.default'}
                defaultMessage={'Add to Bag'}
            />
        }
    </Button>

    return (
        <div className={classes.root}>
            {items.map((item, index) => {
                const hasSpecialPrice = item.minimalPrice !== item.regularPrice;
                return (
                    <div className={classes.row} key={'mixAndMatch-totalRow-'+index}>
                        <div className={classes.name}>
                            {item.name}
                        </div>
                        <div className={classes.price}>
                            <div className={hasSpecialPrice ? classes.priceWrapSpecial : null}>
                                <Price value={item.minimalPrice} currencyCode={currency} />
                            </div>
                            {hasSpecialPrice ?
                                <div>
                                    <Price value={item.regularPrice} currencyCode={currency} />
                                </div> : null
                            }
                        </div>
                    </div>
                )
            })}
            <div className={classes.subtotal}>
                <div className={classes.name}>
                    <FormattedMessage
                        id={'mixAndMatchTotals.subtotal'}
                        defaultMessage={'Subtotal'}
                    />
                </div>
                <div className={classes.price}>
                    <Price value={subTotal} currencyCode={currency} />
                </div>
            </div>
            <div className={classes.buttonWrap}>
                {CTA}
            </div>
        </div>
    )
}

export default MixAndMatchTotals
