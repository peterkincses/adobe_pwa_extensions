import {useMemo} from 'react';
import {useQuery} from '@apollo/client';
import {useModuleConfig} from 'useModuleConfig';
import {deriveErrorMessage} from "@magento/peregrine/lib/util/deriveErrorMessage";

export const useProductSubscriptionsCms = (props = {}) => {
    const {
        getStoreConfigQuery
    } = props;

    const { moduleConfig } = useModuleConfig({
        modules: ['subscribepro']
    });

    const { data, error, loading } = useQuery(getStoreConfigQuery,{
        cachePolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !moduleConfig || !moduleConfig.enabled
    });

    const storeConfig = useMemo(() => {
        if (!data) {
            return null
        }
        return data.storeConfig;
    }, [data]);

    const currency = storeConfig && storeConfig.base_currency_code ? storeConfig.base_currency_code : null;

    const tierData = useMemo(() => {
        if (!moduleConfig || !moduleConfig.enabled) {
            return null
        }

        return moduleConfig.configuration.tiers;

    }, [moduleConfig]);

    const derivedErrorMessage = useMemo(
        () =>
            deriveErrorMessage([
                error
            ]),
        [error]
    );

    return {
        errors: derivedErrorMessage,
        loading: loading,
        tierData,
        currency
    };
};
