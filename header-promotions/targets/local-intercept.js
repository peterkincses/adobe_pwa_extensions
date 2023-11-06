const extendIntercept = require('./extend-intercept');
module.exports = targets => {
    targets.of('@magento/pwa-buildpack').specialFeatures.tap(features => {
        features[targets.name] = {
            cssModules: true,
            esModules: true,
            graphqlQueries: true,
            i18n: true
        };
    });
    extendIntercept(targets);
};
