import {useCallback, useState, useEffect} from "react";
import {useApolloClient, useMutation} from "@apollo/client";

export const useDocScan = props => {
    const {
        docScanStartSessionQuery,
        completeDocScanQuery,
        yotiToken,
        nextView
    } = props;

    const apolloClient = useApolloClient();

    const [docScanStatus, setDocScanStatus] = useState(null);
    const [docScanError, setDocScanError] = useState(null);
    const [docScanNotice, setDocScanNotice] = useState(null);
    const [docScanRequestCount, setDocScanRequestCount] = useState(0);
    const [docScanIframeUrl, setDocScanIframeUrl] = useState(null);
    const [isDocScanModalOpen, setIsDocScanModalOpen] = useState(null);
    const [isDocScanLoading, setIsDocScanLoading] = useState(false);

    const [startDocScanSession, { error: startDocScanSessionError }] = useMutation(docScanStartSessionQuery, {
        fetchPolicy: 'no-cache'
    });

    const startDocScan = () => {
        setDocScanError(null);
        setDocScanNotice(null);
        setDocScanStatus(null);
        setIsDocScanLoading(true);
        startDocScanCallback();
    };

    const startDocScanCallback = useCallback(
        async () => {
            try {
                const docScanStartSessionResponse = await startDocScanSession({
                    variables: {
                        yoti_token: yotiToken
                    }
                });
                if (docScanStartSessionResponse) {
                    setDocScanIframe(docScanStartSessionResponse.data.yotiStartDocScanSession);
                }
            } catch (error) {
                setDocScanError(error.message);
                setDocScanStatus('ERROR');
                console.log(error.message);
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
            }
            setIsDocScanLoading(false);
        },
        [
            apolloClient,
            yotiToken
        ]
    );

    const setDocScanIframe = (response) => {
        if (response) {
            setDocScanIframeUrl(response.iframe_url);
            console.log(response.session_id);
            setIsDocScanModalOpen(true);
            docScanIFrameEvents(response.session_id);
        }
    }

    const onCloseDocScanModal = () => {
        setIsDocScanModalOpen(false);
    }

    const [completeDocScan, { error: completeDocScanError }] = useMutation(completeDocScanQuery, {
        fetchPolicy: 'no-cache'
    });

    const completeDocScanCallback = useCallback(
        async (sessionId) => {
            setDocScanError(null);
            setDocScanRequestCount(docScanRequestCount + 1);
            try {
                const completeDocScanResponse = await completeDocScan({
                    variables: {
                        session_id: sessionId,
                        yoti_token: yotiToken
                    }
                });
                if (completeDocScanResponse) {
                    console.log(completeDocScanResponse);
                    const data = completeDocScanResponse.data.yotiCompleteDocScan;
                    console.log(data);
                    if (data.status === 'APPROVED') {
                        nextView('SUCCESS', data);
                    } else if (data.status === 'PENDING') {
                        setDocScanStatus('PENDING');
                        if (docScanRequestCount < 21) {
                            setTimeout(function () {
                                completeDocScanCallback(sessionId);
                            }, 30000);
                        } else {
                            setDocScanStatus('no-retries');
                        }
                    } else if (data.status === 'ERROR') {
                        setDocScanStatus('ERROR')
                    } else if (data.status === 'NOT_APPROVED') {
                        setDocScanStatus('NOT_APPROVED');
                    }
                }
            } catch (error) {
                setDocScanStatus('ERROR');
                setDocScanError(error.message);
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
            }
        },
        [
            apolloClient,
            yotiToken
        ]
    );

    const docScanIFrameEvents = (sessionId) => {
        console.log(sessionId);
        // https://developers.yoti.com/v4.0/yoti-doc-scan/render-the-user-view#event-notifications
        window.addEventListener(
            'message',
            function(event) {
                console.log('Message received', event.data);

                if (event.data.eventType === 'SUCCESS') {
                    setIsDocScanModalOpen(false);
                    setDocScanError(null);
                    completeDocScanCallback(sessionId);
                }
            }
        );
    }

    return {
        startDocScan,
        docScanStatus,
        docScanError,
        docScanNotice,
        docScanIframeUrl,
        isDocScanModalOpen,
        onCloseDocScanModal,
        isDocScanLoading
    };
}
