import React, {useEffect} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "@bat/yoti/src/components/Yoti/ageVerification.css";

const YotiNotApproved = (props) => {
    const { formatMessage } = useIntl();
    const classes = mergeClasses(defaultClasses, props.classes);

    const [counter, setCounter] = React.useState(10);

    const { minimumAge, handleSignOut } = props;

    setTimeout(function () {
        handleSignOut();
        window.location.replace('//google.com');
    }, counter * 1000);

    useEffect(() => {
        counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    }, [counter]);

    return (
        <section className={classes.yotiBadResult}>
            <div className="container">
                <h2 className={classes.sectionTitle}>
                    {formatMessage({
                        id: 'yotiDocScan.thankYou',
                        defaultMessage: 'Thank you'
                    })}
                </h2>
                <p>
                    <FormattedMessage
                        id={'yotiDocScan.docScanFail'}
                        defaultMessage={'Our customer service could not establish that you are over {minimumAge}. You will now be redirected from our site in {count} seconds.'}
                        values={{minimumAge: minimumAge, count: counter }}
                    /><br/>
                </p>
            </div>
        </section>
    );
};

export default YotiNotApproved;