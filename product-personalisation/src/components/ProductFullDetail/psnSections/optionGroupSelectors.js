import React from "react";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "@bat/product-personalisation/src/components/ProductFullDetail/personalisationPanel.css";
import toolbarClasses from "@bat/product-personalisation/src/components/ProductFullDetail/psnSections/actionToolbar.css";
import optionText from "@bat/product-personalisation/src/components/ProductFullDetail/images/png/option-text.png";
import optionPattern from "@bat/product-personalisation/src/components/ProductFullDetail/images/png/option-pattern.png";
import optionIcon from "@bat/product-personalisation/src/components/ProductFullDetail/images/png/option-icon.png";

const PsnOptionGroupSelectors = props => {
    const {
        psnState,
        cancelLink,
        area,
        handleFrontPsnTypeSelect,
        frontOptions
    } = props;

    const classes = mergeClasses(defaultClasses, toolbarClasses, props.classes);

    const optionImage = (option) => {
        let image;
        if (option === 'text') {
            image = optionText
        } else if (option === 'pattern') {
            image = optionPattern
        } else {
            image = optionIcon;
        }
        return image;
    }

    return (
        <div className={!psnState[area].type ? '' : classes.hidden}>
            <div className={classes.actionToolbar}>
                {cancelLink}
            </div>

            <div data-role="title" className={classes.tabContentTitle} tabIndex="0">
                Customise the <strong>{area}</strong> of your device
            </div>

            <p>How would you like to customise the {area} of your device?</p>

            <div className={classes.personalisationOptions}>
                {frontOptions.map((o, index) => {
                    return <div onClick={e => handleFrontPsnTypeSelect(e, o.type)} index={index}>
                             <label>
                                <span className={classes.psnOptionImgWrap}>
                                    <img alt="" src={optionImage(o.type)}/>
                                </span>
                                <span className={classes.psnOptionTitle}>{o.label}</span>
                             </label>
                           </div>
                })}
            </div>
        </div>
    )
}

export default PsnOptionGroupSelectors;
