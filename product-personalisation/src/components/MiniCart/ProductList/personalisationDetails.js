import React, {Fragment, useState} from "react";
import {FormattedMessage} from "react-intl";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./personalisationDetails.css";
import { ChevronDown, ChevronUp } from 'react-feather';
import Icon from "@magento/venia-ui/lib/components/Icon";

const PersonalisationCartDetails = props => {
    const {
        personalisation
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    const [isOpen, setIsOpen] = useState(false);

    const contentToggleIconSrc = isOpen ? ChevronUp : ChevronDown;

    const contentToggleIcon = <Icon src={contentToggleIconSrc} size={20} />;

    const handleOnClick = () => {
        setIsOpen(!isOpen);
    }

    return (
        <Fragment>
            {personalisation ?
                <div className={classes.root}>
                    <p onClick={handleOnClick} className={classes.psnToggle}>
                        <FormattedMessage
                            id={'personalisationCartDetails.toggleText'}
                            defaultMessage={'Personalisation Details'}
                        />
                        {contentToggleIcon}
                    </p>
                    <div className={isOpen ? classes.detailsWrap : classes.hidden}>
                        {personalisation.front_text || personalisation.icon || personalisation.pattern ?
                            <p>
                                <FormattedMessage
                                    id={'personalisationCartDetails.front'}
                                    defaultMessage={'Front'}
                                />
                            </p> : null
                        }
                        <dl>
                            {personalisation.front_text ?
                                <Fragment>
                                    <dt>
                                        <FormattedMessage
                                            id={'personalisationCartDetails.text'}
                                            defaultMessage={'Text'}
                                        />
                                    </dt>
                                    <dd>{personalisation.front_text}</dd>
                                    <dt>
                                        <FormattedMessage
                                            id={'personalisationCartDetails.orientation'}
                                            defaultMessage={'Orientation'}
                                        />
                                    </dt>
                                    <dd>{personalisation.front_orientation}</dd>
                                    <dt>
                                        <FormattedMessage
                                            id={'personalisationCartDetails.text'}
                                            defaultMessage={'Typeface'}
                                        />
                                    </dt>
                                    <dd>{personalisation.front_font}</dd>
                                </Fragment>
                                : null
                            }
                            {personalisation.icon ? <Fragment>
                                <dt>
                                    <FormattedMessage
                                        id={'personalisationCartDetails.icon'}
                                        defaultMessage={'Icon'}
                                    />
                                </dt>
                                <dd>{personalisation.icon}</dd>
                            </Fragment> : null }
                            {personalisation.pattern ? <Fragment>
                                <dt>
                                    <FormattedMessage
                                        id={'personalisationCartDetails.pattern'}
                                        defaultMessage={'Pattern'}
                                    />
                                </dt>
                                <dd>{personalisation.pattern}</dd>
                            </Fragment> : null }
                        </dl>
                        {personalisation.back_text ?
                            <Fragment>
                                <p>
                                    <FormattedMessage
                                        id={'personalisationCartDetails.back'}
                                        defaultMessage={'Back'}
                                    />
                                </p>
                                <dl>
                                    <dt>
                                        <FormattedMessage
                                            id={'personalisationCartDetails.text'}
                                            defaultMessage={'Text'}
                                        />
                                    </dt>
                                    <dd>{personalisation.back_text}</dd>
                                    <dt>
                                        <FormattedMessage
                                            id={'personalisationCartDetails.orientation'}
                                            defaultMessage={'Orientation'}
                                        />
                                    </dt>
                                    <dd>{personalisation.back_orientation}</dd>
                                    <dt>
                                        <FormattedMessage
                                            id={'personalisationCartDetails.typeface'}
                                            defaultMessage={'Typeface'}
                                        />
                                    </dt>
                                    <dd>{personalisation.back_font}</dd>
                                </dl>
                            </Fragment>
                            : null
                        }
                    </div>
                </div> : null
            }
        </Fragment>
    )
}

export default PersonalisationCartDetails;
