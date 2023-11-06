import { gql } from '@apollo/client';

export const GET_CUSTOMER_APPROVAL_DETAILS = gql`
    query GetCustomerAgeVerificationQuery {
        customer {
            id
            firstname
            is_age_verified
            is_approved
            email
        }
    }
`;

export const YOTI_FACE_SCAN_IMAGE_MUTATION = gql`
    mutation YotiPostFaceScanImage($photo: String!, $yoti_token: String, $device: YotiDeviceEnum!) {
        yotiFaceScan(
            photo: $photo
            yoti_token: $yoti_token
            device: $device
        ) {
            is_age_verified
            status
            can_retry
            auth_token
            error_message
        }
    }
`;