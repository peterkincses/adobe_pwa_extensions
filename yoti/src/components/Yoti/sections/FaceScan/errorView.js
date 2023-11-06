import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "@bat/yoti/src/components/Yoti/ageVerification.css";

import Image from '@magento/venia-ui/lib/components/Image';
import warning from "@bat/yoti/src/components/Yoti/images/warning.svg";
import Button from "@magento/venia-ui/lib/components/Button";

const YotiErrorView = (props) => {
    const { formatMessage } = useIntl();
    const classes = mergeClasses(defaultClasses, props.classes);

    const {errorMessage, errorHint, startAgeScan, canRetry, emailUs } = props;

    return (
        <section id="error" className="yoti-error">
            <div className="container">
                <div className="error-wrapper">
                    <div className="warning-con-wrapper">
                        <Image
                            alt={'Warning'}
                            src={warning}
                            title={'warning'}
                            classes={{image: classes.warningIcon}}
                        />
                    </div>
                    {errorMessage ? <div id="error-message" className={classes.errorMessage}>{errorMessage}</div> : null }
                    {errorHint ? <div id="error-hint" className={classes.errorHint}>{errorHint}</div> : null }

                    <div className={classes.errorButtons}>
                        {canRetry ?
                            <Button
                                onClick={startAgeScan}
                                priority="high"
                                type="submit"
                            >
                                <FormattedMessage
                                    id={'yotiDocScan.startAgain'}
                                    defaultMessage={'Start again'}
                                />
                            </Button> : null
                        }
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

export default YotiErrorView;