import React from "react";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "../personalisationPanel.css";

const TextDirection = (props) => {
    const {
        psnState,
        area,
        handleOptionSelection
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className="field">
            <label className={classes.fieldLabel}>
                Pick your text direction
            </label>
            <div className={classes.textDirectionOptions}>
                <div className={psnState[area].alignment === 'vertical' ? classes.active : null}
                     onClick={e => handleOptionSelection(e, area, {alignment: 'vertical'})}>
                    <label>Vertical</label>
                </div>
                <div className={psnState[area].alignment === 'horizontal' ? classes.active : null}
                     onClick={e => handleOptionSelection(e, area, {alignment: 'horizontal'})}>
                    <label>Horizontal</label>
                </div>
            </div>
        </div>
    )
}

export default TextDirection;
