import React from 'react';
import { mergeClasses } from "@magento/venia-ui/lib/classify";
import { FormattedMessage } from 'react-intl';
import Image from '@magento/venia-ui/lib/components/Image';

import defaultClasses from "@bat/yoti/src/components/Yoti/ageVerification.css";
import warning from "@bat/yoti/src/components/Yoti/images/warning.svg";
import Button from "@magento/venia-ui/lib/components/Button";

const YotiTokenErrorView = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const {errorMessage, emailUs } = props;

    return (
        <section id="error" className="yoti-error">
            <div className="container">
                <div className="error-wrapper">
                    <div className="warning-icon-wrapper">
                        <Image
                            alt={'Warning'}
                            src={warning}
                            title={'warning'}
                            classes={{image: classes.warningIcon}}
                        />
                    </div>
                    {errorMessage ?
                        <div id="error-message" className={classes.errorMessage}>
                            <p>{errorMessage}</p>
                            <p>Please sign in again or contact customer service if you need assistance.</p>
                        </div> : null }

                    <div className={classes.errorButtons}>
                        <Button
                            onClick={emailUs}
                            priority="high"
                            type="submit"
                        >
                            <FormattedMessage
                                id={'yotiDocScan.contactUs'}
                                defaultMessage={'Contact us'}
                            />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default YotiTokenErrorView;
