import React, {Fragment, useState, useEffect} from 'react';
import {FormattedMessage} from 'react-intl';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./browserSupportNotice.css";

const YotiBrowserSupportNotice = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const [isBrowserSupportchecked, setIsBrowserSupportChecked] = useState(false);
    const [displayNotice, setDisplayNotice] = useState(false);
    const userAgentExp = /(?:android)\s*(.*?)(?:ucbrowser)/gi;
    
    useEffect(() => {
        if (!isBrowserSupportchecked) {
            // navigator.mediaDevices evaluates to undefined on some older browsers
            if (typeof navigator.mediaDevices !== 'object' || userAgentExp.test(navigator.userAgent)) {
                setDisplayNotice(true);
            }
            setIsBrowserSupportChecked(true);
        }
    });

    return (
        <Fragment>
            {displayNotice ?
                <div className={classes.root}>
                    <p>
                        <FormattedMessage
                            id={'yotiBrowserSupportNotice.line1'}
                            defaultMessage={'To create an account, we need to verify your age.'}
                        />
                        <br/>
                        <FormattedMessage
                            id={'yotiBrowserSupportNotice.line2'}
                            defaultMessage={'To use our age verification service, we recommend that you use Chrome or Safari'}
                        />
                    </p>
                    <p>
                        <FormattedMessage
                            id={'yotiBrowserSupportNotice.thankYou'}
                            defaultMessage={'Thank you'}
                        />
                    </p>
                </div> : null }
        </Fragment>
    );
};

export default YotiBrowserSupportNotice;