import React, {Fragment} from "react";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "@bat/product-personalisation/src/components/ProductFullDetail/personalisationPanel.css";

const PsnTabHeaders = props => {
    const {
        psnState,
        handleTabHeaderClick
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <ul role="tablist" className={classes.panelTabHeading}>
            <li className={psnState.activePanel === 0 ? classes.active : ''} onClick={e => handleTabHeaderClick(e, 0)} key="0">
                <span className="step">1.</span>Front
            </li>
            <li className={psnState.activePanel === 1 ? classes.active : ''} onClick={e => handleTabHeaderClick(e, 1)} key="1">
                <span className="step">2.</span>Back
            </li>
            <li className={psnState.activePanel === 2 ? classes.active : ''} onClick={e => handleTabHeaderClick(e, 2)} key="2">
                <span className="step">3.</span>Summary
            </li>
        </ul>
    )
}

export default PsnTabHeaders;
