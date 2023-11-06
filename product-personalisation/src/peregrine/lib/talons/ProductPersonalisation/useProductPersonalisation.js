import { useQuery } from '@apollo/client';
import {useCallback, useEffect, useMemo, useState} from "react";
import { useModuleConfig } from 'useModuleConfig';
import {
    GET_PRODUCT_PERSONALISATION_DETAILS,
    GET_PRODUCT_PERSONALISATION_OPTIONS
} from "@bat/product-personalisation/src/components/ProductFullDetail/productPersonalisation.gql";
import {validateRestrictedPsnWords, validateRestrictedPsnCharacters} from "../../../../util/psnValidators";
import {hasLengthAtMost} from "@magento/venia-ui/lib/util/formValidators";

export const useProductPersonalisation = props => {
    const { urlKey, isPsnOpen } = props;

    const { moduleConfig } = useModuleConfig({
        modules: ['personalisation']
    });

    const {
        data: psnOptionsData,
        loading: psnOptionsLoading,
        error: psnOptionsError
    } = useQuery(GET_PRODUCT_PERSONALISATION_OPTIONS);

    const psnOptions = useMemo(() => {
        if (!psnOptionsData) {
            return null
        }
        const { psnOptions } = psnOptionsData;

        if (!psnOptions) {
            return null
        }

        return psnOptions;

    }, [psnOptionsData]);

    const {
        data: psnProductDetailsData,
        loading: psnProductDetailsLoading,
        error: psnProductDetailsError
    } = useQuery(GET_PRODUCT_PERSONALISATION_DETAILS, {
        variables: {
            urlKey: urlKey
        }
    });

    const psnProductDetails = useMemo(() => {
        if (!psnProductDetailsData) {
            return null
        }
        const { products } = psnProductDetailsData;

        if (!products) {
            return null
        }

        return products.items[0];

    }, [psnProductDetailsData]);

    const isModuleConfigLoaded = moduleConfig && moduleConfig.configuration;

    const initialState = {
        activePanel: 0,
        frontPsnType: null,
        previewView: 'front',
        front: {
            type: null,
            value: null,
            alignment: 'vertical',
            textLength: isModuleConfigLoaded ? moduleConfig.configuration.max_characters_vertical : 10,
            fontFamily: null,
            icon: null,
            pattern: null,
            previewImage: null,
            thumbnailImage: null,
            error: false,
            errorMessage: null
        },
        back: {
            type: 'text',
            value: null,
            alignment: 'vertical',
            textLength: isModuleConfigLoaded ? moduleConfig.configuration.max_characters_vertical : 10,
            fontFamily: null,
            typeFace: null,
            error: false,
            errorMessage: null
        }
    }

    const [psnState, setPsnState] = useState(initialState);

    useEffect(() => {
        if (!isPsnOpen) {
            setPsnState(initialState)
        }
    },[isPsnOpen])

    const handleTabHeaderClick = useCallback((event, index) => {
        event.preventDefault();
        setPsnState(prevState => ({
            ...prevState,
            activePanel: index
        }));
        setPreviewStage(index);
    }, []);

    const setPreviewStage = (index) => {
        if (index === 0) {
            setPsnState(prevState => ({
                ...prevState,
                previewView: 'front'
            }));
        }
        if (index === 1) {
            setPsnState(prevState => ({
                ...prevState,
                previewView: 'back'
            }));
        }
    }

    const handleFrontPsnTypeSelect = (event, type) => {
        event.preventDefault();
        setPsnState(prevState => ({
            ...prevState,
            front: {
                ...initialState.front,
                type: type
            }
        }));
    }

    const handleOptionSelection = (event, area, option) => {
        event.preventDefault();
        if (area === 'front') {
            if (psnState.front.type === 'pattern') {
                setPsnState(prevState => ({
                    ...prevState,
                    front: {
                        ...prevState.front,
                        thumbnailImage: option.thumbnail_image,
                        previewImage: option.thumbnail_image,
                        pattern: option.pattern_name,
                        value: option.pattern_name
                    }
                }))
            }
            if (psnState.front.type === 'icon') {
                setPsnState(prevState => ({
                    ...prevState,
                    front: {
                        ...prevState.front,
                        thumbnailImage: option.thumbnail_image,
                        previewImage: option.thumbnail_image,
                        icon: option.icon_name,
                        value: option.icon_name
                    }
                }))
            }

            if (psnState.front.type === 'text') {
                //@todo: reduce this with conditional properties and variables
                if (option.alignment) {
                    const maxCharacterLength = option.alignment === 'vertical' ? moduleConfig.configuration.max_characters_vertical : moduleConfig.configuration.max_characters_horizontal;
                    setPsnState(prevState => (
                        {
                            ...prevState,
                            front: {
                                ...prevState.front,
                                alignment: option.alignment,
                                textLength: maxCharacterLength
                            }
                        }));
                    validateTextInput(psnState.front.value, area, maxCharacterLength);
                }
                if (option.font_name) {
                    setPsnState(prevState => (
                        {
                            ...prevState,
                            front: {
                                ...prevState.front,
                                fontFamily: option.font_name
                            }
                        }))
                }
                if (option.value || option.value === '') {
                    validateTextInput(option.value, area, psnState.front.textLength);
                }
            }
        }

        if (area === 'back') {
            if (psnState.back.type === 'text') {
                //@todo: reduce this with conditional properties and variables
                if (option.alignment) {
                    const maxCharacterLength = option.alignment === 'vertical' ? moduleConfig.configuration.max_characters_vertical : moduleConfig.configuration.max_characters_horizontal;
                    validateTextInput(psnState.back.value, area, maxCharacterLength);
                    setPsnState(prevState => (
                        {
                            ...prevState,
                            back: {
                                ...prevState.back,
                                alignment: option.alignment,
                                textLength: maxCharacterLength
                            }
                        }));
                }
                if (option.font_name) {
                    setPsnState(prevState => (
                        {
                            ...prevState,
                            back: {
                                ...prevState.back,
                                fontFamily: option.font_name
                            }
                        }))
                }
                if (option.value || option.value === '') {
                    validateTextInput(option.value, 'back', psnState.back.textLength);
                }
            }
        }
    }

    const validateTextInput = (value, area, maxLength) => {
        const isRestrictedWord = value ? validateRestrictedPsnWords(value, moduleConfig.configuration.restricted_words.word) : undefined;
        const isRestrictedChar = value ? validateRestrictedPsnCharacters(value, moduleConfig.configuration.regex) : undefined;
        const isValidLength = value ? hasLengthAtMost(value, null, maxLength) : undefined;

        setPsnState(prevState => ({
            ...prevState,
            [area]: {
                ...prevState[area],
                text: value,
                value: value,
                errorMessage: null,
                error: false
            }
        }));
        if (isRestrictedWord !== undefined) {
            setPsnState(prevState => ({
                ...prevState,
                [area]: {
                    ...prevState[area],
                    error: true,
                    errorMessage: isRestrictedWord.defaultMessage
                }
            }))
        }
        if (isRestrictedChar !== undefined) {
            setPsnState(prevState => ({
                ...prevState,
                [area]: {
                    ...prevState[area],
                    error: true,
                    errorMessage: isRestrictedChar.defaultMessage
                }
            }))
        }
        if (isValidLength !== undefined) {
            setPsnState(prevState => ({
                ...prevState,
                [area]: {
                    ...prevState[area],
                    error: true,
                    errorMessage: isValidLength.defaultMessage
                }
            }))
        }
    }

    const clearAreaSelection = (event, area) => {
        event.preventDefault();
        setPsnState(prevState => ({
            ...prevState,
            [area]: {
                ...initialState[area]
            }
        }));
    }

    const skipAreaCustomisation = (event, nextTab, area) => {
        event.preventDefault();
        clearAreaSelection(event, area);
        setPsnState(prevState => ({
            ...prevState,
            activePanel: prevState.activePanel + 1
        }));
    }

    return {
        isPsnEnabled: moduleConfig ? moduleConfig.enabled : false,
        psnConfig: moduleConfig ? moduleConfig.configuration : null,
        psnOptions,
        psnProductDetails,
        psnState,
        handleTabHeaderClick,
        handleFrontPsnTypeSelect,
        handleOptionSelection,
        skipAreaCustomisation,
        clearAreaSelection
    };
};
