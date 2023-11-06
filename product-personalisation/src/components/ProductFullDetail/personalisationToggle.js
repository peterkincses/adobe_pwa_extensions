import React, {Fragment} from "react";
import {FormattedMessage} from "react-intl";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./personalisationToggle.css";
import Image from "@magento/venia-ui/lib/components/Image";
import toggleIcon from "@bat/product-personalisation/src/components/ProductFullDetail/images/png/option-text.png";
import {useProductPersonalisationToggle} from "../../peregrine/lib/talons/ProductPersonalisation/useProductPersonalisationToggle";

const PersonalisationToggle = props => {
    const {
        togglePsnVisibility,
        product
    } = props;

    const talonProps = useProductPersonalisationToggle({
        urlKey: product.url_key
    });

    const {
        isPsnEnabled,
        psnProductDetails
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const shouldShow = isPsnEnabled && psnProductDetails && psnProductDetails.psn_is_personalisable === true;

    return (
        <Fragment>
            {shouldShow ?
                <section className={classes.root} onClick={togglePsnVisibility}>
                    <div className={classes.imageWrap}>
                        <Image
                            alt={'Personalisation toggle icon'}
                            src={toggleIcon}
                            title={'title'}
                            width={45}
                            height="auto"
                        />
                    </div>
                    <div className={classes.textWrap}>
                        <p>
                            <FormattedMessage
                                id={'productPersonalisationToggle.heading'}
                                defaultMessage={'Engrave your device'}
                            />
                        </p>
                        <p>
                            <FormattedMessage
                                id={'productPersonalisationToggle.text'}
                                defaultMessage={'Add a pattern, a mini icon or text to your device'}
                            />
                        </p>
                    </div>
                    <div className={classes.addWrap}>
                        <FormattedMessage
                            id={'productPersonalisationToggle.add'}
                            defaultMessage={'Add'}
                        />
                    </div>
                </section> : null
            }
        </Fragment>
    )
}

export default PersonalisationToggle;