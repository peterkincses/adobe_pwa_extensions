import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "@bat/yoti/src/components/Yoti/ageVerification.css";

import Image from '@magento/venia-ui/lib/components/Image';
import lightRoom from '@bat/yoti/src/components/Yoti/images/light-room.svg';
import noHeadWear from '@bat/yoti/src/components/Yoti/images/no-headwear.svg';
import glasses from '@bat/yoti/src/components/Yoti/images/glasses.svg';
import Button from "@magento/venia-ui/lib/components/Button";

const YotiIntro = (props) => {
    const { formatMessage } = useIntl();
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <section id="intro" className="yoti-intro">
            <div className="container">
                <h1 className={classes.pageTitle}>
                    {formatMessage({
                        id: 'yotiVerification.heading',
                        defaultMessage: 'Estimate your age using your face'
                    })}
                </h1>
                <div className={classes.instructionsList}>
                    <div className={classes.listItem} data-qa="light-room">
                        <Image
                            alt={'Find a light area'}
                            src={lightRoom}
                            title={'Find a light area'}
                        />
                        <p id="light-room-text">
                            {formatMessage({
                                id: 'yotiVerification.lightRoomText',
                                defaultMessage: 'Find a light area'
                            })}
                        </p>
                    </div>
                    <div className={classes.listItem} data-qa="no-headwear">
                        <Image
                            alt={'Remove any headwear'}
                            src={noHeadWear}
                            title={'Remove any headwear'}
                        />
                        <p id="no-headwear-text">
                            {formatMessage({
                                id: 'yotiVerification.noHeadWear',
                                defaultMessage: 'Remove hat to reduce shadow'
                            })}
                        </p>
                    </div>
                    <div className={classes.listItem} data-qa="glasses-on">
                        <Image
                            alt={'Keep your glasses on'}
                            src={glasses}
                            title={'Keep your glasses on'}
                        />
                        <p id="glasses-on-text">
                            {formatMessage({
                                id: 'yotiVerification.keepGlasses',
                                defaultMessage: 'Keep your glasses on'
                            })}
                        </p>
                    </div>
                </div>
                <div className="conditions">
                    <p className="you-will-be-asked-to">
                        {formatMessage({
                            id: 'yotiVerification.enableCamera',
                            defaultMessage: 'You will be asked to enable camera access'
                        })}
                    </p>
                </div>
                <Button
                    onClick={props.startAgeScan}
                    priority="high"
                    type="submit"
                >
                    <FormattedMessage
                        id={'yotiAgeScan.startEstimation'}
                        defaultMessage={'Start Estimation'}
                    />
                </Button>
            </div>
        </section>
    );
};

export default YotiIntro;