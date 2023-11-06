import React from "react";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "../personalisationPanel.css";

const PsnFonts = (props) => {
    const {
        psnState,
        fonts,
        area,
        handleOptionSelection
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <>
            {fonts ?
                fonts.map((option, index) => {
                    const isActive = psnState[area].type === 'text' && psnState[area].fontFamily === option.font_name;
                    const fontClassName = option.font_name ? option.font_name.toLowerCase().replace(/\s/g, '') : null;

                    return (
                        <div className={isActive ? classes.active : null } data-category=""
                             key={index}
                             onClick={e => handleOptionSelection(e, area, option)}>
                            <label>
                                <span className={classes.psnOptionFontWrap}>
                                    <span className={fontClassName}>
                                        {option.preview_text}
                                    </span>
                                </span>
                                <span className={classes.psnOptionTitle}>
                                    {option.font_name}
                                </span>
                            </label>
                        </div>
                    )
                }) : null
            }
        </>
    )
}

export default PsnFonts;
