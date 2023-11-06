const extendIntercept = require('./extend-intercept');

module.exports = targets => {
    /*
     * Here we explicitly list the modules that is used on the extensions.
     * @see https://developer.adobe.com/commerce/pwa-studio/api/buildpack/webpack/configure/
     */
    targets.of('@magento/pwa-buildpack').specialFeatures.tap(features => {
        features[targets.name] = {
            cssModules: true,
            esModules: true,
            graphqlQueries: true,
            i18n: true
        };
    });

    targets.of('@magento/venia-ui').routes.tap(routes => {
        routes.push({
            name: 'Store Locations',
            pattern: '/store-locations',
            path: require.resolve('../index.js')
        });
        routes.push({
            name: 'Store Locator Store Page',
            pattern: '/store-location/:id',
            path: '@eshopworld/store-locator/src/components/StoreLocator/DetailsPage'
        });
        return routes;
    });

    extendIntercept(targets);
};
