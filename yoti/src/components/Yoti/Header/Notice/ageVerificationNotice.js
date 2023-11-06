import React, {Fragment, useEffect} from 'react';
import {FormattedMessage} from 'react-intl';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./ageVerificationNotice.css";
import {useUserContext} from "@magento/peregrine/lib/context/user";

import BrowserPersistence from "@magento/peregrine/lib/util/simplePersistence";
import {Link} from "react-router-dom";
import { useModuleConfig } from '../../../../../../../peregrine/lib/hooks/useModuleConfig';

const storage = new BrowserPersistence();

const YotiAgeVerificationHeaderNotice = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const [{ currentUser, isSignedIn }, {}] = useUserContext();
    
    const { moduleConfig } = useModuleConfig({
        modules: ['yoti_age_verification']
    });
    const isYotiEnabled = moduleConfig && (moduleConfig.configuration.face_scan_enabled || moduleConfig.configuration.doc_scan_enabled);

    const firstName = currentUser.firstname;

    const link = <Link to={'/yoti/verification/age'}>
                    <FormattedMessage
                        id={'yotiHeaderNotice.linkText'}
                        defaultMessage={'click on this link'}
                    />
                </Link>;

    const yotiVerified = storage.getItem('yoti_is_age_verified');
    const isYotiLanding = window.location.pathname === '/yoti/verification/age';

    return (
        <Fragment>
            {isYotiEnabled && isSignedIn && yotiVerified !== 'undefined' && yotiVerified === false && firstName ?
                <div className={classes.root}>
                    <p>
                        <FormattedMessage
                            id={'yotiHeaderNotice.messageLine1'}
                            defaultMessage={'Hi {firstName}, please note that we need you to verify your age before you can place an order from our store.'}
                            values={{firstName: firstName}}
                        /><br/>
                        {!isYotiLanding ?
                        <FormattedMessage
                            id={'yotiHeaderNotice.messageLine2'}
                            defaultMessage={'Please {link} to complete our verification process.'}
                            values={{firstName: firstName, link: link}}
                        /> : null }
                    </p>
                </div> : null
            }
        </Fragment>
    );
};

export default YotiAgeVerificationHeaderNotice;
