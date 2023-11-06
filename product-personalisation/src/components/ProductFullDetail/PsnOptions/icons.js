import React from "react";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "../personalisationPanel.css";

const PsnIcons = (props) => {
    const {
        psnState,
        icons,
        handleOptionSelection
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <>
            {icons ?
                icons.map((icon, index) => {
                    const isActive = psnState.front.type === 'icon' && psnState.front.value === icon.icon_name;

                    return (
                        <div className={isActive ? classes.active : null}
                             data-category="" key={index}
                             onClick={e => handleOptionSelection(e, 'front', icon)}>
                            <label>
                                <span className={classes.psnOptionImgWrap}>
                                    <img src={icon.thumbnail_image} alt="icon-personalisation"/>
                                </span>
                                <span className={classes.psnOptionTitle}>{icon.icon_name}</span>
                            </label>
                        </div>
                    )
                }) : null
            }
        </>
    )
}

export default PsnIcons;
