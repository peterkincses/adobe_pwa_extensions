import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "@bat/yoti/src/components/Yoti/ageVerification.css";

import Image from '@magento/venia-ui/lib/components/Image';
import yotiLogo from "@bat/yoti/src/components/Yoti/images/yoti-logo.svg";

const YotiSecurityNotice = (props) => {
    const { formatMessage } = useIntl();
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.securityNotice}>
            <small>
                {formatMessage({
                    id: 'yotiDocScan.securityNotice',
                    defaultMessage: 'Documents and images will be automatically deleted after verification'
                })}
            </small>
        </div>
    );
};

export default YotiSecurityNotice;