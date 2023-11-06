import React, {Fragment} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "@bat/yoti/src/components/Yoti/sections/FaceScan/cameraView.css";

import Image from '@magento/venia-ui/lib/components/Image';
import Button from "@magento/venia-ui/lib/components/Button";
import backArrow from "@bat/yoti/src/components/Yoti/images/back-arrow.svg";

import FaceCapture, { CAPTURE_METHOD } from "@getyoti/react-face-capture";
import "@getyoti/react-face-capture/index.css";

const YotiCameraView = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { moduleConfig, backToIntro, takePicture } = props;

    //@todo: ideally we'd like to point to @getyoti instead of placing files in the /static-assets
    //upward also interprets the shard image as a page rather than a file because it does not have a file extension,
    // so we are currently adding the extension and pointing to it via the manifest.json in static-assets
    const assetsUrl = `/static-assets/yoti/assets/face-capture/`;

    const onSuccess = ({ image }) => {
        takePicture(image);
    }
    const onError = (error) => console.log('Error =', error);

    return (
        <Fragment>
            <div className={classes.root}>
                <Button
                    classes={{root_highPriority: classes.backToIntro}}
                    onClick={backToIntro}
                    priority="high"
                    type="submit"
                >
                    <Image
                        classes={{loaded: classes.backToIntroLoaded}}
                        alt={'Back'}
                        src={backArrow}
                        title={'Back'}
                        width={20}
                        height={20}
                    />
                    <span className={classes.backToIntroButtonText}>
                        <FormattedMessage
                            id={'yotiVerification.backToIntro'}
                            defaultMessage={'Back'}
                        />
                    </span>
                </Button>
                <div className={classes.videoWrapper}>
                    {/*@todo: language code is not available via the graphql at the moment hence the hardcoded en*/}
                    <FaceCapture
                        captureMethod={CAPTURE_METHOD.AUTO}
                        onSuccess={onSuccess}
                        onError={onError}
                        faceCaptureAssetsRootUrl={assetsUrl}
                        language={moduleConfig && moduleConfig.language_code ? moduleConfig.language_code : "en"}
                    />
                </div>
            </div>
        </Fragment>
    )
};

export default YotiCameraView;
