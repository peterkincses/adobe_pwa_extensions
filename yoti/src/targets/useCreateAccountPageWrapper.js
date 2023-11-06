import {useCallback} from "react";
import { useModuleConfig } from '../../../../peregrine/lib/hooks/useModuleConfig';
import { useHistory } from 'react-router-dom';

const wrapUseCreateAccountPage = (original) => {
    return function useCreateAccountPage(props, ...restArgs) {
        const history = useHistory();
        
        const { moduleConfig } = useModuleConfig({
            modules: ['yoti_age_verification']
        });
        const isYotiEnabled = moduleConfig && (moduleConfig.configuration.face_scan_enabled || moduleConfig.configuration.doc_scan_enabled);

        const { handleCreateAccount, ...defaultReturnData } = original(
            props,
            ...restArgs
        );

        const handleYotiCreateAccount = useCallback(() => {
            history.push('/yoti/verification/age');
        }, [history]);

        return {
            ...defaultReturnData,
            handleCreateAccount: isYotiEnabled ? handleYotiCreateAccount : handleCreateAccount
        };
    };
};

export default wrapUseCreateAccountPage;