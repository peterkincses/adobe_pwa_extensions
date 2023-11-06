import React from "react";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "../personalisationPanel.css";

const PsnTextInput = (props) => {
    const {
        psnState,
        area,
        handleOptionSelection
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    const inputName = "personalisation." + area +"_text";

    return (
        <div className={classes.field}>
            <label className={classes.fieldLabel}>
                Enter your text
            </label>
            <div className={psnState[area].error ? classes.inputWrapError : classes.inputWrap}>
                <input
                    name={inputName}
                    autoComplete="off"
                    type="text"
                    placeholder="Enter your text"
                    onChange={e => handleOptionSelection(e, area, {value: e.target.value})}
                    maxLength={psnState[area].textLength}
                    value={psnState[area].value ? psnState[area].value : ''}
                />
            </div>
            {psnState[area].error ?
                <p className={classes.errorMessage}>{psnState[area].errorMessage}</p> : null
            }
            <p className={classes.inputNote}>
                Add up to <span className="limit">{psnState[area].textLength}</span> characters
            </p>
        </div>
    )
}

export default PsnTextInput;
