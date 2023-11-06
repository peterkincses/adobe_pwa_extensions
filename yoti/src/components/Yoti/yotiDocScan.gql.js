import { gql } from '@apollo/client';
import {ItemsReviewFragment} from "@magento/peregrine/lib/talons/CheckoutPage/ItemsReview/itemsReviewFragments.gql";

export const YOTI_START_DOC_SCAN_MUTATION = gql`
    mutation YotiStartDocScanSession($yoti_token: String) {
        yotiStartDocScanSession(
            yoti_token: $yoti_token
        ) {
            session_id
            session_token
            iframe_url
        }
    }
`;

export const YOTI_COMPLETE_DOC_SCAN_MUTATION = gql`
    mutation YotiCompleteDocScan($session_id: String!, $yoti_token: String) {
        yotiCompleteDocScan(
            session_id: $session_id
            yoti_token: $yoti_token
        ) {
            is_age_verified
            status
            can_retry
            auth_token
            message
        }
    }
`;