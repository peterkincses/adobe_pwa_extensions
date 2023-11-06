import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "@bat/yoti/src/components/Yoti/ageVerification.css";

import Image from '@magento/venia-ui/lib/components/Image';
import icoLoadingSpinner from "@bat/yoti/src/components/Yoti/images/ico-loading-spinner.svg";

const YotiPreparingResult = (props) => {
    const { formatMessage } = useIntl();
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <section id="preparing-result" className={classes.yotiPreparingResult}>
            <div className={classes.timerWrapper}>
                <Image
                    className={classes.prepareVideoTimer}
                    alt={'Calculating your age...'}
                    src={icoLoadingSpinner}
                    title={'Calculating your age...'}
                />
                <div className="section-title">
                    {formatMessage({
                        id: 'yotiAgeScan.calculatingAge',
                        defaultMessage: 'Calculating your age…'
                    })}
                </div>
            </div>
        </section>
    );
};

export default YotiPreparingResult;