import {gql} from "@apollo/client";

export const GET_STORE_LOCATOR_CONFIG = gql`
    query GetStoreLocatorConfig {
        storeConfig {
           store_code
           general_country_default
           general_locale_firstday
           locale
        }
        MpStoreLocatorConfig {
            KMLinfowindowTemplatePath
            locationsData {
                name
                locationId
                holidayData {
                    from
                    to
                    __typename
                }
                timeData {
                    from
                    to
                    value
                    __typename
                }
            }
            dataLocations
            markerIcon
            zoom
            keyMap
            defaultLat
            defaultLng
            isDefaultStore
            locationIdDetail
        }
    }
`;

export const GET_COUNTRY_FULL_NAME = gql`
    query GetCountryFullName (
       $countryCode: String!
    ) {
        country (id: $countryCode) {
           full_name_english
        }
    }
`;

export const GET_STORE_LOCATOR_LOCATIONS = gql`
    query GetStoreLocatorLocations (
       $location_id: String
       $country: String
       $state_province: String
       $city: String
       $street: String
       $postal_code: String
       $search_term: String
    ) {
        MpStoreLocatorLocations (
            search_term: $search_term
            filter: {
               location_id: {eq: $location_id}
               status: {eq: "1"}
               country: {like: $country}
               state_province: {like: $state_province}
               city: {like: $city}
               street: {like: $street}
               postal_code: {like: $postal_code}
            })
        {
            items {
                brand {
                  id
                  label
                }
                cid
                city
                country
                description
                email
                fax
                holidayData {
                    from
                    to
                    __typename
                }
                images
                latitude
                location_id
                longitude
                name
                openCloseData {
                    label
                    status
                }
                phone_one
                phone_two
                postal_code
                status
                store_ids
                street
                state_province
                timeData {
                    from
                    to
                    value
                    __typename
                }
            }
            total_count
        }
    }
`;

export const GET_STORE_LOCATOR_NEAREST_LOCATIONS = gql`
    query GetStoreLocatorNearestLocations (
       $location_id: String!
       $limit: Int
    ) {
        MpStoreLocatorLocations (
            filter: {
               location_id: {eq: $location_id}
            }
            nearestLocationsLimit: $limit
            )
        {
            items {
                name
                nearestStoresLocations {
                    latitude
                    location_id
                    longitude
                    name
                    openCloseData {
                        label
                        status
                    }
                    postal_code
                    status
                    store_ids
                    street
                    state_province
                    timeData {
                        from
                        to
                        value
                        __typename
                    }
                }
            }
        }
    }
`;



export default {
    getStoreLocatorConfigQuery: GET_STORE_LOCATOR_CONFIG,
    getCountryFullNameQuery: GET_COUNTRY_FULL_NAME,
    getStoreLocatorLocationsQuery: GET_STORE_LOCATOR_LOCATIONS,
    getStoreLocatorNearestLocationsQuery: GET_STORE_LOCATOR_NEAREST_LOCATIONS
}
