export const isLatLongQuery = (str) => {
    // Regular expression to check if string is a latitude and longitude
    const regexExp = /^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/gi;

    return regexExp.test(str);
};

export const getPositionFromQuery = (query) => {
    if (isLatLongQuery(query)) {
        return query.split(',');
    }
};

export const calculateDistance = (lat1, lng1, lat2, lng2, unit) => {
    if ((lat1 == lat2) && (lng1 == lng2)) {
        return 0;
    }
    else {
        const radLat1 = Math.PI * lat1/180;
        const radLat2 = Math.PI * lat2/180;
        const theta = lng1-lng2;
        const radTheta = Math.PI * theta/180;
        let dist = Math.sin(radLat1) * Math.sin(radLat2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1.609344 } //km
        if (unit=="N") { dist = dist * 0.8684 } //Nautical miles
        return Math.round(dist * 100) / 100;
    }
};

export const sortByDistance = (currentLocation, items) => {
    const [lat, long] = currentLocation;
    let sortItems = [...items];

    sortItems.sort(function (a, b) {
        const distanceA = calculateDistance(lat, long, a.latitude, a.longitude);
        const distanceB = calculateDistance(lat, long, b.latitude, b.longitude);
        return distanceA - distanceB;
    });

    return sortItems;
};


