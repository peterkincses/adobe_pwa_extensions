const SUCCESS = undefined;

export const validateRestrictedPsnWords = (value, values) => {
    const message = {
        id: 'validation.RestrictedPsnWords',
        defaultMessage: 'Sorry, this is a restricted word we would prefer you don\'t use.'
    };

    let check = false;

    const inputArray = value.toLowerCase().split(' ');
    const inputArrayWordGroups = value.toLowerCase().replace(/ /g,'').split(',');
    const restrictedWordGroups = values.toString().replace(/ /g,'').split(',');

    inputArray.some(function(item) {
        if (values.includes(item)) {
            check = true;
        }
    });

    inputArrayWordGroups.some(function(item) {
        if (restrictedWordGroups.includes(item)) {
            check = true;
        }
    });

    if (check) {
        return message;
    }

    return SUCCESS;
};

export const validateRestrictedPsnCharacters = (value, values) => {
    const message = {
        id: 'validation.restrictedPsnCharacters',
        defaultMessage: 'Sorry, one or more of these characters is not allowed.'
    };

    const psnCharacters = new RegExp(values);

    if(!psnCharacters.test(value)) {
        return message;
    }

    return SUCCESS;
};
