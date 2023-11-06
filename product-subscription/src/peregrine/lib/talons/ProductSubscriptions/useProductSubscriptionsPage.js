import {useEffect, useMemo} from 'react';
import { useHistory } from 'react-router-dom';
import {useUserContext} from "@magento/peregrine/lib/context/user";
import {useQuery} from "@apollo/client";
import {useModuleConfig} from 'useModuleConfig';

export const useProductSubscriptionsPage = (props = {}) => {
    const {getStoreConfigQuery} = props;
    const history = useHistory();
    const [{ isSignedIn }] = useUserContext();

    const { moduleConfig } = useModuleConfig({
        modules: ['subscribepro']
    });

    useEffect(() => {
        if (!isSignedIn || !moduleConfig || !moduleConfig.enabled) {
            history.push('/');
        }
    }, [history, isSignedIn, moduleConfig]);

    const { data: storeConfigData } = useQuery(getStoreConfigQuery, {
        cachePolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const storeConfig = useMemo(() => {
        if (!storeConfigData) {
            return null
        }
        return storeConfigData.storeConfig;
    }, [storeConfigData]);

    const currency = storeConfig && storeConfig.base_currency_code ? storeConfig.base_currency_code : null;

    return {
        moduleConfig,
        currency
    };
};
