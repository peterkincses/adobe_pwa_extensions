import {useUserContext} from "@magento/peregrine/lib/context/user";
import {useState, useEffect} from 'react';
import {useApolloClient} from "@apollo/client";
import { useHistory } from 'react-router-dom';

import {GET_CUSTOMER_APPROVAL_DETAILS} from '@bat/yoti/src/components/Yoti/yotiAgeVerification.gql';
import { useModuleConfig } from '../../../../peregrine/lib/hooks/useModuleConfig';

import BrowserPersistence from "@magento/peregrine/lib/util/simplePersistence";
const storage = new BrowserPersistence();

const wrapUseSignIn = (original) => {

    return function useSignIn(props, ...restArgs) {
        
        const { moduleConfig } = useModuleConfig({
            modules: ['yoti_age_verification']
        });
        const isYotiEnabled = moduleConfig && (moduleConfig.configuration.face_scan_enabled || moduleConfig.configuration.doc_scan_enabled);

        const { ...defaultReturnData } = original(
            props,
            ...restArgs
        );

        const history = useHistory();
        const apolloClient = useApolloClient();

        const [{ isSignedIn }, {}] = useUserContext();

        const [redirectCheck, setRedirectCheck] = useState(false);

        useEffect(() => {
            if (isYotiEnabled && !redirectCheck && isSignedIn) {
                storage.removeItem('yoti_is_age_verified');
                apolloClient.query({
                    query: GET_CUSTOMER_APPROVAL_DETAILS
                }).then(({ error, data }) => {
                    if (data && data.customer) {
                        storage.setItem('yoti_is_age_verified', data.customer.is_age_verified);
                        if (data.customer.is_approved === "notapproved" && !data.customer.is_age_verified) {
                            //todo: logout and display error that they are not allowed to log in
                            //we shouldn't be logging in a user if they are not approved. This scenario has been flagged to back end devs to
                            //extend the approval graphql so that it would throw an error if the is_approved flag is false
                        } else if (!data.customer.is_age_verified) {
                            history.push('/yoti/verification/age');
                        }
                    }
                });
                setRedirectCheck(true)
            }
        })

        return {
            ...defaultReturnData
        };
    };
};

export default wrapUseSignIn;
