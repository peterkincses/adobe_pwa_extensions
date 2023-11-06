import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "@bat/yoti/src/components/Yoti/ageVerification.css";
import Button from "@magento/venia-ui/lib/components/Button";
import { useHistory } from 'react-router-dom';
import { GET_ITEM_COUNT_QUERY } from '@magento/venia-ui/lib/components/Header/cartTrigger.gql';
import {useCartContext} from "@magento/peregrine/lib/context/cart";
import {useQuery} from "@apollo/client";
import {useUserContext} from "@magento/peregrine/lib/context/user";

const YotiSuccess = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const history = useHistory();

    const [{ cartId }] = useCartContext();
    const [{ currentUser }] = useUserContext();

    //@todo: move to talon
    const { data } = useQuery(GET_ITEM_COUNT_QUERY, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            cartId
        },
        skip: !cartId
    });

    const itemCount = data ? data.cart.total_quantity : 0;

    const backToHome = () => {
        history.push('/');
    }

    const finishCheckout = () => {
        history.push('/cart');
    }

    return (
        <section id="result">
            <div className="container">
                <h2 className={classes.sectionTitle}>
                    <FormattedMessage
                        id={'yotiSuccess.salutation'}
                        defaultMessage={`Welcome ${currentUser.firstname}!`}
                    />
                </h2>
                <p>
                    <FormattedMessage
                        id={'yotiVerificationSuccess.accountConfirmedText'}
                        defaultMessage={'Your account has been verified. You can now order on our site.'}
                    />
                </p>
            </div>
            <div className="actions">
                <Button
                    onClick={itemCount ? finishCheckout : backToHome}
                    priority="high"
                    type="submit"
                >
                    {itemCount ?
                        <FormattedMessage
                            id={'yotiVerificationSuccess.finishCheckout'}
                            defaultMessage={'Finish the checkout'}
                        />
                        :
                        <FormattedMessage
                            id={'yotiVerificationSuccess.backToHome'}
                            defaultMessage={'Continue to our site'}
                        />
                    }
                </Button>
            </div>
        </section>
    );
};

export default YotiSuccess;
