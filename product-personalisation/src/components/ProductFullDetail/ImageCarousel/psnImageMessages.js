import React, {Fragment} from "react";
import defaultClasses from './psnImageMessages.css';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import {FormattedMessage} from "react-intl";

const PsnImageMessages = props => {
    const {
        psnState,
        isMissingOptions,
        images
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Fragment>
            {isMissingOptions ||
               psnState.previewView === 'front' && !images[0].file ||
               psnState.previewView === 'back' && !images[1].file ?
                <div className={classes.root}>
                    {isMissingOptions ?
                        <p>
                            <FormattedMessage id={'psnNoImage.noSwatch'} defaultMessage={'No swatch option selected'} />
                        </p>
                        : psnState.previewView === 'front' && !images[0].file ||
                          psnState.previewView === 'back' && !images[1].file?
                            <p>
                                <FormattedMessage
                                    id={'psnNoImage.noSwatch'}
                                    defaultMessage={'No {previewArea} personalisation image specified'}
                                    values={{previewArea: psnState.previewView}}
                                />
                            </p> : null
                    }
                </div> : null
            }
        </Fragment>
    )

}

export default PsnImageMessages;