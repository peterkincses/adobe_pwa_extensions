import React, {Fragment} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import { Link, resourceUrl } from '@magento/venia-drivers';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "@bat/yoti/src/components/Yoti/ageVerification.css";
import Button from "@magento/venia-ui/lib/components/Button";
import Dialog from "@magento/venia-ui/lib/components/Dialog";
import loaderIcon from "@bat/yoti/src/components/Yoti/images/ajax-loader.gif";
import Image from "@magento/venia-ui/lib/components/Image";

import {useDocScan} from "@bat/yoti/src/talons/AgeVerification/useDocScan";
import { YOTI_START_DOC_SCAN_MUTATION, YOTI_COMPLETE_DOC_SCAN_MUTATION } from '@bat/yoti/src/components/Yoti/yotiDocScan.gql';
import {fullPageLoadingIndicator} from "@magento/venia-ui/lib/components/LoadingIndicator";
import YotiNotApproved from "../notApproved";

const YotiDocScan = (props) => {
    const { formatMessage } = useIntl();

    const {
        minimumAge,
        yotiToken,
        nextView,
    } = props;

    const talonProps = useDocScan(
        {
            docScanStartSessionQuery: YOTI_START_DOC_SCAN_MUTATION,
            completeDocScanQuery: YOTI_COMPLETE_DOC_SCAN_MUTATION,
            yotiToken: yotiToken,
            nextView
        }
    );

    const {
        startDocScan,
        docScanStatus,
        docScanError,
        docScanNotice,
        docScanIframeUrl,
        isDocScanModalOpen,
        onCloseDocScanModal,
        isDocScanLoading
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const customerServiceLink = <Link to={resourceUrl('contact')} className={classes.customerServiceLink}>
        <FormattedMessage
            id={'docScan.customerServiceLink'}
            defaultMessage={'customer service'}
        />
    </Link>;

    return (
        <Fragment>
            {docScanError ? <div className={classes.docScanError}>{docScanError}</div> : null }
            {docScanNotice ? <div className={classes.docScanNotice}>{docScanNotice}</div> : null }
            {docScanStatus === null ?
                <div className={classes.idscanMessage}>
                    <p>
                        <FormattedMessage
                            id={'yotiDocScan.moreInfo1'}
                            defaultMessage={'It seems we need additional confirmation.'}
                        /><br/>
                        <FormattedMessage
                            id={'yotiDocScan.moreInfo2'}
                            defaultMessage={'We will need your identity document at this stage.'}
                        />
                    </p>
                    <Button
                        onClick={startDocScan}
                        priority="high"
                        type="submit"
                    >
                        <FormattedMessage
                            id={'yotiDocScan.uploadDocuments'}
                            defaultMessage={'Upload my documents'}
                        />
                    </Button>
                </div> : null
            }

            {docScanStatus === 'retry' || docScanStatus === 'PENDING' ?
                <div>
                    <h2 className={classes.sectionTitle}>
                        {formatMessage({
                            id: 'yotiDocScan.thanks',
                            defaultMessage: 'Thank you'
                        })}
                    </h2>
                    <p>
                        {formatMessage({
                            id: 'yotiDocScan.uploadInProgressMessage',
                            defaultMessage: 'Please wait, we are processing your documents. It will take a maximum of 10 minutes. We ask you not to refresh this page or close this tab.'
                        })}
                    </p>
                    <div>
                        <Image
                            classes={{container: classes.docScanLoadingIcon}}
                            alt={'Loader...'}
                            src={loaderIcon}
                            title={'Loader'}
                            width={15}
                            height={15}
                        />
                    </div>
                </div> : null
            }
            {docScanStatus === 'no-retries' ?
                <div className="yoti-id-scan-notice no-retries">
                    <p>
                        <FormattedMessage
                            id={'yotiDocScan.uploadInMaxRequestMessageLine1'}
                            defaultMessage={'We are very sorry however the maximum amount of requests have been exhausted and we have not been able to verify your details.'}
                            values={{link: customerServiceLink}}
                        /><br/>
                        <FormattedMessage
                            id={'yotiDocScan.uploadInMaxRequestMessageLine2'}
                            defaultMessage={'Please contact our {link} if you require assistance.'}
                            values={{link: customerServiceLink}}
                        />
                    </p>
                </div> : null
            }
            {docScanStatus === 'ERROR' ?
                <div className="yoti-id-scan-notice">
                    <p>
                        <FormattedMessage
                            id={'yotiDocScan.restartDocScanError'}
                            defaultMessage={'Sorry, something went wrong. Please restart the doc scan process by clicking the button below or contact our {link} if you require assistance.'}
                            values={{link: customerServiceLink}}
                        />
                    </p>
                    <Button
                        onClick={startDocScan}
                        priority="high"
                        type="submit"
                    >
                        <FormattedMessage
                            id={'yotiDocScan.uploadDocuments'}
                            defaultMessage={'Upload my documents'}
                        />
                    </Button>
                </div> : null
            }

            {docScanStatus === 'NOT_APPROVED'? <YotiNotApproved minimumAge={minimumAge}/> : ''}

            {docScanIframeUrl ?
                <Dialog
                isOpen={isDocScanModalOpen}
                shouldShowButtons={false}
                onCancel={onCloseDocScanModal}
                >
                    <iframe allow="camera"
                            className="yoti-docs-scan-popup"
                            frameBorder="0"
                            seamless
                            src={docScanIframeUrl}
                            width="100%" height="600"
                    />
                </Dialog>
                : null
            }
            {isDocScanLoading ? fullPageLoadingIndicator : null }
        </Fragment>
    );
};

export default YotiDocScan;