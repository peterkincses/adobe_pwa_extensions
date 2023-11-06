import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import defaultClasses from './details.css';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import {useStoreLocatorDetailsPage} from "@eshopworld/store-locator/src/talons/StoreLocator/Details/useStoreLocatorDetailsPage";
import DEFAULT_OPERATIONS from "../storeLocator.gql";
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";
import ErrorView from "@magento/venia-ui/lib/components/ErrorView";
import StoreLocatorLocationStatus from "../List/Item/LocationStatus";
import GoogleMapReact from 'google-map-react';
import LinkButton from "@magento/venia-ui/lib/components/LinkButton";
import {Calendar, Phone, MapPin, Plus, Minus} from 'react-feather';
import Icon from "@magento/venia-ui/lib/components/Icon";
import {FormattedMessage} from "react-intl";
import NearestLocations from "./NearestLocations";
import Breadcrumbs from "@eshopworld/store-locator/src/components/StoreLocator/Breadcrumbs";
//@todo: dates should be part of timeData object
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const { matchMedia } = globalThis;

const StoreLocatorDetailsPage = (props) => {
    let { id: locationId } = useParams();

    const {
        getStoreLocatorConfigQuery,
        getStoreLocatorLocationsQuery
    } = DEFAULT_OPERATIONS;

    const classes = mergeClasses(defaultClasses, props.classes);
    const isSmallScreen = matchMedia && matchMedia('(max-width: 939px)').matches;
    const [isHoursOpen, setIsHoursOpen] = useState(!isSmallScreen);
    const openingHoursVisibility = isSmallScreen && !isHoursOpen ? classes.hoursHidden : '';

    const {
        formatHours,
        storeConfig,
        storeLocatorConfig,
        location,
        loading
    } = useStoreLocatorDetailsPage({
        storeLocatorConfigQuery: getStoreLocatorConfigQuery,
        storeLocatorLocationsQuery: getStoreLocatorLocationsQuery,
        locationId: locationId
    });

    if (loading) {
        return <LoadingIndicator />
    }

    if (!storeLocatorConfig || !location) {
        return <ErrorView />;
    }

    const {
        keyMap
    } = storeLocatorConfig;

    const {
        general_locale_firstday,
    } = storeConfig;

    const mapOptions = {
        showFullscreenButton: false,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControlOptions: {
            position: 7,//window.google.maps.ControlPosition.RIGHT_TOP
            style: 1 // window.google.maps.ZoomControlStyle.SMALL
        }
    }

    const {
        cid,
        city,
        latitude,
        longitude,
        name,
        openCloseData,
        phone_one,
        postal_code,
        state_province,
        street,
        timeData
    } = location;

    const locale = storeConfig ? storeConfig.locale : 'en_US';
    const country = storeConfig ? storeConfig.general_country_default : 'US';

    const locationLatLng = {
        lat: Number(latitude),
        lng: Number(longitude)
    };

    const sortTimeData = (timeData) => {
        let day = general_locale_firstday;
        const result = [];
        do {
            result.push({
                'label': weekDays[day],
                'time': timeData[day]
            });
            day = (day + 1) % 7;
        }
        while (result.length < timeData.length);

        return result;
    };

    const getOpeningHours = () => {
        if (!timeData || !timeData.length) { return null }
        return sortTimeData(timeData).map((day, index) => {
            return (
                <div className={classes.weekDay} key={'store-details-weekday' + index}>
                    <div>
                        {day?.label}
                    </div>
                    <div>
                        {formatHours(day?.time?.from)} - {formatHours(day?.time?.to)}
                    </div>
                </div>
            )
        })
    }

    const initMap = ({maps, map}) => {
        new maps.Marker({
            position: locationLatLng,
            map: map,
        })
    }

    const cidLink = cid ? 'https://maps.google.com/?cid='+ cid : null;
    const handleDirectLinkClick = () => {
        window.open(cidLink, '_blank');
    }

    const toggleOpeningHours = () => {
        if(!isSmallScreen) { return }
        setIsHoursOpen(!isHoursOpen);
    }

    return (
        <>
            <Breadcrumbs pageType={'details'} location={location} />
            <title>
                <FormattedMessage id={'storeLocator.detailsPageTitle'}
                                  defaultMessage={'Store locator - {name}'}
                                  values={{
                                      name
                                  }}
                />
            </title>
            <div className={classes.root}>
                <div className={classes.pageTitle}>
                    <h1>{name}</h1>
                </div>
                <div className={classes.mapContainerLarge}>
                    <GoogleMapReact
                        bootstrapURLKeys={{
                            key: keyMap,
                            libraries: ['places'],
                            locale: locale
                        }}
                        center={locationLatLng}
                        zoom={18}
                        onGoogleApiLoaded={initMap}
                        options={mapOptions}
                    />
                </div>
                <div className={classes.details}>
                    <div className={`${classes.column} ${openingHoursVisibility}`}>
                        <h3>
                            <FormattedMessage id={'storeLocator.storeHoursHeading'}
                                              defaultMessage={'Store Hours & Info'}
                            />
                        </h3>
                        <div className={classes.hasIcon} onClick={toggleOpeningHours}>
                            <div>
                                <Icon src={Calendar} size={20} />
                            </div>
                            <div className={classes.hours}>
                                <StoreLocatorLocationStatus openCloseData={openCloseData}
                                                            classes={{
                                                                root: classes.storeStatus,
                                                                status: classes.status
                                                            }}
                                />
                                {isSmallScreen &&
                                    <Icon src={isHoursOpen ? Minus : Plus} size={20} className={classes.toggleIcon}/>
                                }
                            </div>
                        </div>
                        <div className={classes.openingHours}>
                            <div className={classes.weekdays}>
                                {getOpeningHours()}
                            </div>
                            {/*<div className={classes.openingNotes}>*/}
                            {/*    <ul>*/}
                            {/*        <li>In-Store Pickup until close.</li>*/}
                            {/*        <li>Curbside Pickup until 5:00 PM.</li>*/}
                            {/*    </ul>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                    <div className={classes.column}>
                        {phone_one &&
                            <div className={`${classes.phone} ${classes.hasIcon}`}>
                                <div>
                                    <Icon src={Phone} size={20}/>
                                </div>
                                <div><a href={`tel:${phone_one}`}>{phone_one}</a></div>
                            </div>
                        }
                        <div className={`${classes.address} ${classes.hasIcon}`}>
                            <div>
                                <Icon src={MapPin} size={20} />
                            </div>
                            <div>
                                <address>
                                    {street}<br/>
                                    {city}, {state_province} {postal_code}
                                </address>
                                {cid &&
                                    <div className={classes.directionsLink}>
                                        <a href={cidLink} target="_blank">
                                            <FormattedMessage id={'storeLocator.directionsLinkText'}
                                                              defaultMessage={'Get Directions'}
                                            />
                                        </a>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={classes.smallMapOuter}>
                        <div className={classes.mapContainerSmall}>
                            <GoogleMapReact
                                bootstrapURLKeys={{
                                    key: keyMap,
                                    libraries: ['places'],
                                    locale: locale
                                }}
                                center={locationLatLng}
                                zoom={18}
                                onGoogleApiLoaded={initMap}
                                options={mapOptions}
                            />
                            {cid &&
                                <div className={classes.directionsLink}>
                                    <LinkButton onClick={handleDirectLinkClick} priority={'high'}>
                                        <FormattedMessage id={'storeLocator.directionsLinkText'}
                                                          defaultMessage={'Get Directions'}
                                        />
                                    </LinkButton>
                                </div>
                            }
                        </div>
                    </div>
                    {/*<div className={classes.column}>*/}
                    {/*    <h3>At this location (out of scope)</h3>*/}
                    {/*    <div className={classes.hasIcon}>*/}
                    {/*        <div>*/}
                    {/*            <Icon src={Phone} size={20} />*/}
                    {/*        </div>*/}
                    {/*        <div>*/}
                    {/*            <a href="https://ae.com/us/en/">AE</a>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <div className={classes.hasIcon}>*/}
                    {/*        <div>*/}
                    {/*            <Icon src={Phone} size={20} />*/}
                    {/*        </div>*/}
                    {/*        <div>Apple Pay</div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
                <NearestLocations location={location} locationId={locationId} country={country} />
            </div>
        </>
    )
}

export default StoreLocatorDetailsPage;
