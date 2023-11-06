import React, {useEffect, useRef, Fragment} from 'react';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./ageVerification.css";
import {useAgeVerification} from "../../talons/AgeVerification/useAgeVerification";
import { useModuleConfig } from '../../../../../peregrine/lib/hooks/useModuleConfig';

import YotiNotApproved from "./sections/notApproved";
import YotiSuccess from "./sections/success";
import YotiDisclaimer from "./sections/disclaimer";
import YotiSecurityNotice from "./sections/securityNotice";

import YotiIntro from "./sections/FaceScan/intro";
import YotiCameraView from "./sections/FaceScan/cameraView";
import YotiErrorView from "./sections/FaceScan/errorView";
import YotiPreparingResult from "./sections/FaceScan/preparingResult";
import YotiOrientationError from "./sections/FaceScan/orientationError";

import YotiDocScan from "./sections/DocScan/docScan";

import { YOTI_FACE_SCAN_IMAGE_MUTATION } from './yotiAgeVerification.gql';
import {GET_CART_DETAILS_QUERY} from "@magento/venia-ui/lib/components/SignIn/signIn.gql";
import YotiTokenErrorView from "./yotiTokenError";
import YotiBrowserSupportNotice from "./BrowserSupportNotice";

const AgeVerification = (props) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const { moduleConfig } = useModuleConfig({
        modules: ['yoti_age_verification']
    });

    const talonProps = useAgeVerification(
        {
            moduleConfig,
            faceScanImageQuery: YOTI_FACE_SCAN_IMAGE_MUTATION,
            getCartDetailsQuery: GET_CART_DETAILS_QUERY,
            videoRef: videoRef,
            canvasRef: canvasRef
        }
    );

    const {
        appState,
        startAgeScan,
        takePicture,
        backToIntro,
        emailUs,
        errorMessage,
        errorHint,
        canRetry,
        yotiToken,
        nextView,
        handleSignOut
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const YotiInlineStyles = `
         header,
         nav[class^="megaMenu-nav"],
         div[class^="uspBanner"],
         div[class^="newsletterBar"],
         div[id="ot-sdk-btn"],
         footer {display: none!important}
     `;

    useEffect(() => {});

    return (
        <Fragment>
            {moduleConfig && (moduleConfig.configuration.face_scan_enabled || moduleConfig.configuration.doc_scan_enabled)  ?
                <div>
                    <style dangerouslySetInnerHTML={{__html: YotiInlineStyles}} />
                    <YotiBrowserSupportNotice/>
                    <div className={classes.root}>
                        <div className={classes.innerWrap}>
                                {appState === 'INTRO' ?
                                    <YotiIntro startAgeScan={startAgeScan}/> : null
                                }
                                {appState === 'CAMERA' ?
                                    <section className={classes.yotiCamera}>
                                        <YotiCameraView moduleConfig={moduleConfig.configuration}
                                                        backToIntro={backToIntro}
                                                        takePicture={takePicture}
                                        />
                                    </section> : null
                                }

                                {appState === 'PREPARING_RESULT' ?
                                    <YotiPreparingResult/> : null
                                }
                                {appState === 'UNCERTAIN' ?
                                    <section id="result" className="yoti-result">
                                        <div className="container">
                                            { appState === 'UNCERTAIN' && moduleConfig.configuration.doc_scan_enabled ?
                                                <YotiDocScan
                                                    yotiToken={yotiToken}
                                                    minimumAge={moduleConfig.configuration.minimum_age}
                                                    nextView={nextView}
                                                /> : null
                                            }
                                        </div>
                                    </section> : null
                                }
                                {appState === 'NOT_APPROVED' ?
                                    <YotiNotApproved minimumAge={moduleConfig.configuration.minimum_age} handleSignOut={handleSignOut}/> : null
                                }
                                {appState === 'ERROR' || appState === 'RETRY' ?
                                    <YotiErrorView
                                        errorMessage={errorMessage}
                                        errorHint={errorHint}
                                        startAgeScan={startAgeScan}
                                        canRetry={canRetry}
                                        emailUs={emailUs}
                                    />
                                    : null
                                }
                                {appState === 'YOTI_TOKEN_ERROR' ?
                                    <YotiTokenErrorView errorMessage={errorMessage} emailUs={emailUs} /> : null
                                }
                                {appState === 'SUCCESS' ?
                                    <YotiSuccess /> : null
                                }
                            </div>
                    </div>

                    <YotiSecurityNotice/>
                    <YotiDisclaimer/>
                    <YotiOrientationError/>
                </div>
             : null }
        </Fragment>
    );
};

export default AgeVerification;
