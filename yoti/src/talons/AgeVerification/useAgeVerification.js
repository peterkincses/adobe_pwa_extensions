import {useCallback, useMemo, useState, useEffect} from "react";
import {useLocation,useHistory} from 'react-router-dom';
import {useApolloClient, useMutation, useQuery} from "@apollo/client";
import {clearCartDataFromCache} from "@magento/peregrine/lib/Apollo/clearCartDataFromCache";
import {clearCustomerDataFromCache} from "@magento/peregrine/lib/Apollo/clearCustomerDataFromCache";
import {retrieveCartId} from "@magento/peregrine/lib/store/actions/cart";
import {useCartContext} from "@magento/peregrine/lib/context/cart";
import {useUserContext} from "@magento/peregrine/lib/context/user";
import {useAwaitQuery} from "@magento/peregrine/lib/hooks/useAwaitQuery";

import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/SignIn/signIn.gql';
import SIGN_OUT_OPERATIONS from '@magento/peregrine/lib/talons/Header/accountMenu.gql';
import mergeOperations from "@magento/peregrine/lib/util/shallowMerge";

import BrowserPersistence from "@magento/peregrine/lib/util/simplePersistence";

const storage = new BrowserPersistence();

export const getSearchParam = (parameter = '', location = window.location) => {
    const params = new URLSearchParams(location.search);

    return params.get(parameter) || '';
};

export const useAgeVerification = props => {
    const {
        moduleConfig,
        getCartDetailsQuery,
        faceScanImageQuery
    } = props;

    const [{ currentUser, isSignedIn }, { getUserDetails, setToken, signOut }] = useUserContext();

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        createCartMutation,
        getCustomerQuery,
        mergeCartsMutation
    } = operations;

    const { signOutMutation } = SIGN_OUT_OPERATIONS;

    const apolloClient = useApolloClient();

    const [appState, setAppState] = useState('INTRO');
    const [errorMessage, setErrorMessage] = useState(null);
    const [yotiToken, setYotiToken] = useState(null);
    const [yotiTokenChecked, setYotiTokenChecked] = useState(false);
    const [errorHint, setErrorHint] = useState(null);
    const [canRetry, setCanRetry] = useState(true);
    const [docScanViewChecked, setDocScanViewChecked] = useState(false);
    const [isForcedSignOut, setIsForcedSignOut] = useState(false);

    const history = useHistory();

    const ERROR = 39019;

    const deviceTypes = {
        MOBILE: 'MOBILE',
        LAPTOP: 'LAPTOP',
        DESKTOP: 'DESKTOP',
        UNKNOWN: 'UNKNOWN'
    };

    const deviceCheck = () => {
        let check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
                check = true;
            })(navigator.userAgent || navigator.vendor || window.opera);
            if (check) {
                return deviceTypes.MOBILE;
            } else {
                return deviceTypes.LAPTOP;
            }
    }

    //const device = deviceTypes.LAPTOP;
    const device = deviceCheck();

    const display = (view, result) => {
        setAppState(view);
        switch (view) {
            case 'INTRO': {}
                break;
            case 'CAMERA': {}
                break;
            case 'PREPARING_RESULT': {}
                break;
            case 'RETRY': {
                if (result.can_retry) {
                    if (result.status === 'PENDING' || result.status === 'ERROR' || result.status === 'BAD_QUALITY') {
                        setErrorMessage(result.error_message);
                        setErrorHint('Please check your surroundings and submit a new picture so we can verify your age.');
                    }
                } else {
                    setErrorMessage('No more retries left. We were unable to detect your face in order to estimate your age.');
                    setErrorHint('Please contact us so we can assist you further.');
                    setCanRetry(false);
                }
            }
                break;
            case 'UNCERTAIN': {}
                break;
            case 'SUCCESS': {
                //@todo: show success after signin
                if (!isSignedIn) {
                    handleSignIn(result.auth_token);
                }

            }
                break;
            case 'NOT_APPROVED': {}//loads notApproved.js component
                break;
            case 'ERROR': {
                if (result) {
                    if (result.error_message) {
                        setErrorMessage(result.error_message);
                    } else if (result.error) {
                        setErrorMessage(result.error);
                    }
                }
                break;
            }
            default: {}
                break;
        }
    }

    const nextView = function (view, result) {
        display(view, result);
    }

    const startAgeScan = () => {
        nextView('CAMERA')
    }

    function printResults(result) {
        console.log(result);
        if (typeof result.is_age_verified !== 'undefined') {
            if (result.is_age_verified) {
                nextView('SUCCESS', result);
            } else if (!result.is_age_verified) {
                //@todo: current responses are missing uncertainty, this will need to be expanded
                if(result.status === 'ERROR' || result.status === 'PENDING' || result.status === 'BAD_QUALITY') {
                    nextView('RETRY', result);
                } else if (result.status === 'NOT_APPROVED') {
                    nextView('NOT_APPROVED', result);
                }
            }
        } else {
            nextView(ERROR, result);
        }
    };

    const [postFaceScanImage, { error: postFaceScanImageError }] = useMutation(faceScanImageQuery, {
        fetchPolicy: 'no-cache'
    });

    const handleFaceScanImage = useCallback(
        async (image, yotiToken) => {
            try {
                const faceScanImagePostResponse = await postFaceScanImage({
                    variables: {
                        photo: image,
                        yoti_token: yotiToken,
                        device: device
                    }
                });

                if (faceScanImagePostResponse) {
                    printResults(faceScanImagePostResponse.data.yotiFaceScan);
                }
            } catch (error) {
                setAppState('ERROR');
                setErrorMessage(error.message);
                //setCameraError(cameraErrors.GeneralError);
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
            }
        },
        [
            moduleConfig,
            apolloClient,
            yotiToken
        ]
    );

    const [
        { cartId },
        { createCart, removeCart, getCartDetails }
    ] = useCartContext();

    const [fetchCartId] = useMutation(createCartMutation);
    const [mergeCarts] = useMutation(mergeCartsMutation);
    const fetchUserDetails = useAwaitQuery(getCustomerQuery);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const handleSignIn = useCallback(
        async (auth_token) => {
            try {
                await setToken(auth_token);

                // // Clear all cart/customer data from cache and redux.
                await clearCartDataFromCache(apolloClient);
                await clearCustomerDataFromCache(apolloClient);
                await removeCart();

                const sourceCartId = cartId;

                // // Create and get the customer's cart id.
                await createCart({
                    fetchCartId
                });
                const destinationCartId = await retrieveCartId();

                // Merge the guest cart into the customer cart.
                await mergeCarts({
                    variables: {
                        destinationCartId,
                        sourceCartId
                    }
                });
                //
                // // Ensure old stores are updated with any new data.
                getUserDetails({fetchUserDetails});
                getCartDetails({fetchCartId, fetchCartDetails});
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
            }
        },
        [
            cartId,
            apolloClient,
            removeCart,
            setToken,
            createCart,
            fetchCartId,
            mergeCarts,
            getUserDetails,
            fetchUserDetails,
            getCartDetails,
            fetchCartDetails
        ]
    );

    const [revokeToken] = useMutation(signOutMutation);

    const handleSignOut = useCallback(async () => {
        // Delete cart/user data from the redux store.
        setIsForcedSignOut(true);
        await signOut({ revokeToken });
    }, [history, revokeToken, signOut]);

    const postImage = (image) => {
        handleFaceScanImage(image, yotiToken);
    };

    const backToIntro = () => {
        nextView('INTRO')
    }

    const takePicture = (image) => {
        if (!image) {
            setErrorMessage('No image detected');
            nextView('ERROR');
        } else {
            nextView('PREPARING_RESULT');
            postImage(image);
        }
    }

    const emailUs = () => {
        history.push('/contact')
    }

    const location = useLocation();

    useEffect(() => {
        if (isSignedIn && currentUser && appState === 'SUCCESS') {
            storage.setItem('yoti_is_age_verified', true);
        }
    }, [isSignedIn, currentUser, appState]);

    useEffect(() => {
        if (isSignedIn && currentUser && storage.getItem('yoti_is_age_verified') === true) {
            setAppState('SUCCESS');
        }
    }, [isSignedIn, currentUser, setAppState]);

    useEffect(() => {
        if (!yotiTokenChecked && !isSignedIn && !isForcedSignOut) {
            const value = getSearchParam('token', location);
            if (storage.getItem('yoti_token')) {
                setYotiToken(storage.getItem('yoti_token'));
            } else if (value) {
                setYotiToken(value);
            } else {
                setAppState('YOTI_TOKEN_ERROR');
                setErrorMessage('No Yoti token found which is necessary for our identity validation service.')
            }
            setYotiTokenChecked(true);
        }

        if ( !docScanViewChecked
             && moduleConfig
             && !moduleConfig.configuration.face_scan_enabled
             && moduleConfig.configuration.doc_scan_enabled
        ) {
            setAppState('UNCERTAIN');
            setDocScanViewChecked(true);
        }
    }, [
        appState,
        yotiToken,
        docScanViewChecked,
        isSignedIn,
        yotiTokenChecked,
        isForcedSignOut,
        moduleConfig,
        location
    ]);

    return {
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
    };
}
