import React from 'react';
import {useIntl} from 'react-intl';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "@bat/yoti/src/components/Yoti/ageVerification.css";

import Image from '@magento/venia-ui/lib/components/Image';
import orientationError from '@bat/yoti/src/components/Yoti/images/orientation-error.svg';

const YotiOrientationError = (props) => {
    const { formatMessage } = useIntl();
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.orientationError}>
            <Image
                alt={'Landscape'}
                src={orientationError}
                title={'Find a light area'}
                classes={{image: classes.orientationErrorImage}}
            />
            <p className={classes.pleaseTurnYourDev}>
                {formatMessage({
                    id: 'yotiDocScan.orientationError',
                    defaultMessage: 'Please turn your device to portrait mode'
                })}
            </p>
        </div>
    );
};

export default YotiOrientationError;