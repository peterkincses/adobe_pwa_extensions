import React, {Fragment, useCallback, useState} from "react";
import defaultClasses from './personalisationPreview.css';
import {mergeClasses} from "@magento/venia-ui/lib/classify";


const PersonalisationPreview = props => {
    const {
        psnState
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    const fontFamilyClass = (area) => {
        return psnState && psnState[area].fontFamily ?
            psnState[area].fontFamily.toLowerCase().replace(/\s/g, '') : null;
    }

    return (
        <Fragment>
            {psnState.previewView === 'front' ? (
                <Fragment>
                    {psnState.front.pattern ?
                        <div className={classes.psnPreview}>
                            <img src={psnState.front.previewImage} />
                        </div> : null
                    }

                    {psnState.front.icon ?
                        <div className={classes.psnPreview}>
                            <img src={psnState.front.previewImage} />
                        </div> : null
                    }

                    {psnState.front.text ?
                        <div className={psnState.front.alignment === 'vertical' ? classes.psnPreviewTextVertical : classes.psnPreviewText}>
                            <span className={fontFamilyClass('front')}>
                                {psnState.front.value}
                            </span>
                        </div> : null
                    }
                </Fragment>
            ) : null }

            {psnState.previewView === 'back' && psnState.back.text ?
                <div className={psnState.back.alignment === 'vertical' ? classes.psnPreviewTextVertical : classes.psnPreviewText}>
                    <span className={fontFamilyClass('back')}>{psnState.back.value}</span>
                </div>
            : null }
        </Fragment>
    )
}

export default PersonalisationPreview;