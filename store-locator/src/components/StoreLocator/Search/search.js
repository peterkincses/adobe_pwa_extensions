import React, {useRef} from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './search.css';
import { Form } from 'informed';
import Field from '@eshopworld/core/src/components/Field';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Button from '@magento/venia-ui/lib/components/Button';
import { FormattedMessage, useIntl } from 'react-intl';
import TextInput from '@eshopworld/core/src/components/TextInput';
import { Navigation as NavigationIcon, X as CloseIcon } from 'react-feather';
import { useSearch } from '@eshopworld/store-locator/src/talons/StoreLocator/Search/useSearch';
import Icon from "@magento/venia-ui/lib/components/Icon";
import {useStoreLocatorContext} from "../storeLocator";

const StoreLocatorSearch = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const {
        clearSearch,
        handleChange,
        handleGeoLocationSearch,
        handleSearch,
        initialValues
    } = useSearch();

    const {
        storeLocatorState
    } = useStoreLocatorContext();

    const { formatMessage } = useIntl();

    return (
        <div className={classes.root}>
            <Form
                className={classes.search}
                initialValues={initialValues}
                onSubmit={handleSearch}
            >
                <div className={classes.searchBar}>
                    <Field id="storeLocatorSearchLabel"
                           label={formatMessage({
                               id: 'storeLocator.searchPlaceholderText',
                               defaultMessage: 'Find a store near you'
                           })}
                    >
                        <TextInput
                            field="search"
                            id={'storeLocatorSearch'}
                            mask={value => value && value.trim()}
                            maskOnBlur={true}
                            onChange={handleChange}
                            validate={isRequired}
                            placeholder={formatMessage({
                                id: 'storeLocatorSearch.inputPlaceholderText',
                                defaultMessage: 'Find a store near you'
                            })}
                        />
                        {storeLocatorState.searchQuery &&
                            <Button className={classes.clearSearch}>
                                <Icon src={CloseIcon} size={10} onClick={clearSearch}
                                      className={classes.closeIcon}
                                />
                                <span className={classes.clearSearchText}>
                                    <FormattedMessage id={'storeLocatorSearch.clearSearchText'}
                                                      defaultMessage={'Clear Search'}
                                    />
                                </span>
                            </Button>
                        }
                    </Field>
                </div>
                <Button
                    disabled={false}
                    priority={'normal'}
                    classes={{ root_normalPriority: classes.searchButton }}
                    type={'submit'}
                >
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                         xmlnsXlink="http://www.w3.org/1999/xlink">
                        <use xlinkHref="#search"></use>
                    </svg>
                    <span>
                        <FormattedMessage
                            id={'storeLocatorSearch.searchLocations'}
                            defaultMessage={'Search Locations'}
                        />
                    </span>
                </Button>
                <Button
                    disabled={false}
                    priority={'normal'}
                    classes={{ root_normalPriority: classes.geolocationButton }}
                    onClick={handleGeoLocationSearch}
                >
                    <NavigationIcon width={20} height={20} />
                    <span>
                        <FormattedMessage
                            id={'storeLocatorSearch.geolocateText'}
                            defaultMessage={'Geolocate'}
                        />
                    </span>
                </Button>
            </Form>
        </div>
    );
};

export default StoreLocatorSearch;
