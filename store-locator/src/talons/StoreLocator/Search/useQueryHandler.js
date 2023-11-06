import React, { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export const stripSpecialCharacter = string => string.replace(/[&\/\\!@#$ ^*()_~'":?<>{}]/g, '');

export const useQueryHandler = (props) => {
    const history = useHistory();
    const location = useLocation();
    const { search } = location;

    const params = new URLSearchParams(search);

    const getSanitizedQueryFromUrl = useCallback(() => {
        const query = params.get('q');
        if (!query) return query;

        const newQuery = stripSpecialCharacter(query);
        params.set('q', decodeURIComponent(newQuery));
        if (newQuery !== query) {
            setQueryParam('q', newQuery);
        }
        return newQuery;
    }, [params, search]);

    const setQueryParam = (parameter, value) => {
        params.set(parameter, value);
        const destination = { search: decodeURIComponent(params.toString()) };
        history.push(destination);
    };

    const deleteQueryParam = (parameter) => {
        params.delete(parameter);
        const destination = { search: params.toString()};
        history.push(destination);
    }

    const getCurrentQuery = () => params.get('q');

    return {
        deleteQueryParam,
        getSanitizedQueryFromUrl,
        getCurrentQuery,
        setQueryParam
    };
};
