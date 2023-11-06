import React from "react";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "../personalisationPanel.css";

const PsnPatterns = (props) => {
    const {
        psnState,
        patterns,
        handleOptionSelection
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <>
            {patterns ?
                patterns.map((option, i) => {
                    const isActive = psnState.front.type === 'pattern' && psnState.front.value === option.pattern_name;

                    return (
                        <div className={isActive ? classes.active : null}
                             data-category="" key={i}
                             onClick={e => handleOptionSelection(e, 'front', option)}>
                            <label>
                                    <span className={classes.psnOptionImgWrap}>
                                        <img src={option.thumbnail_image} alt={option.pattern_name} />
                                    </span>
                                <span className={classes.psnOptionTitle}>{option.pattern_name}</span>
                            </label>
                        </div>
                    )
                })
                : null
            }
        </>
    )
}

export default PsnPatterns;
