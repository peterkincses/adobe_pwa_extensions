import React, {useMemo} from 'react';
import { useQueryHandler } from './useQueryHandler';

export const useSearch = (props) => {
    const { getCurrentQuery, setQueryParam, deleteQueryParam } = useQueryHandler();
    const query = getCurrentQuery();

    const initialValues = useMemo(() => {
        if (query) {
            return {
                search: query,
            };
        }
    }, [query]);

    const handleSearch = (props) => {
        const {
            search
        } = props;

        setQueryParam('q', search);
    };

    const handleChange = (props) => {
        if (!props.target.value) {
            clearSearch();
        }
    }

    const clearSearch = () => {
        deleteQueryParam('q')
    }

    const handleGeoLocationSearch = () => {
        //https://developers.google.com/maps/documentation/javascript/geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    setQueryParam('q', position.coords.latitude + ',' + position.coords.longitude);
                },
                () => {
                    handleLocationError();
                }
            );
        } else {
            // Browser doesn't support Geolocation
            handleLocationError();
        }
    }

    const handleLocationError = () => {
        alert('Sorry, we are unable to determine your location at this time.')
    }

    return {
        clearSearch,
        handleChange,
        handleGeoLocationSearch,
        handleSearch,
        initialValues
    }
};
