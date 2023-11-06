import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "@bat/yoti/src/components/Yoti/ageVerification.css";

import Image from '@magento/venia-ui/lib/components/Image';
import yotiLogo from "@bat/yoti/src/components/Yoti/images/yoti-logo.svg";

const YotiDisclaimer = (props) => {
    const { formatMessage } = useIntl();
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.disclaimer}>
            <Image
                classes={{container: classes.disclaimerLogo}}
                alt={'Yoti logo'}
                src={yotiLogo}
                title={'Yoti logo'}
                width={50}
                height={35}
            />
            <span><small>
                {formatMessage({
                    id: 'yotiAgeScan.poweredByYoti',
                    defaultMessage: 'Powered by Yoti'
                })}
            </small></span>
        </div>
    );
};

export default YotiDisclaimer;