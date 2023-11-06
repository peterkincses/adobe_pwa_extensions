/**
 * Custom intercept file for the extension
 * By default you can only use target of @magento/pwa-buildpack.
 *
 * If do want extend @magento/peregrine or @magento/venia-ui
 * you should add them to peerDependencies to your package.json
 *
 * If you want to add overwrites for @magento/venia-ui components you can use
 * moduleOverrideWebpackPlugin and componentOverrideMapping
 */
const moduleOverridePlugin = require('./moduleOverrideWebpackPlugin');
const componentOverrideMapping = {
    '@magento/venia-ui/lib/components/CartPage/ProductListing/productListingFragments.js':
        'src/@bat/product-subscription/src/components/CartPage/ProductListing/productListingFragments.js',
};

module.exports = targets => {
    const { talons } = targets.of('@magento/peregrine');

    // talons.tap((talonWrapperConfig) => {
    //     console.log(talonWrapperConfig);
    // });

    // talons.tap(({ RootComponents }) => {
    //     RootComponents.Category.useCategory.wrapWith('@bat/product-subscription/src/targets/useCategoryWrapper');
    // });

    talons.tap(({ AccountMenu }) => {
        AccountMenu.useAccountMenuItems.wrapWith('@bat/product-subscription/src/targets/useAccountMenuItemsWrapper');
    });

    targets.of('@magento/pwa-buildpack').specialFeatures.tap(flags => {
        /**
         *  Wee need to activated esModules and cssModules to allow build pack to load our extension
         * {@link https://magento.github.io/pwa-studio/pwa-buildpack/reference/configure-webpack/#special-flags}.
         */
        flags[targets.name] = {esModules: true, cssModules: true};
    });

    targets.of('@magento/venia-ui').routes.tap(routes => {
        //add cms content
        routes.push({
            name: 'Product Subscriptions',
            pattern: '/subscriptions',
            path: require.resolve('./components/ProductSubscription/CmsPage')
        });
        routes.push({
            name: 'Product Subscriptions',
            pattern: '/product-subscription',
            path: require.resolve('./')
        });
        routes.push({
            name: 'Product Subscriptions',
            pattern: '/product-subscription/edit/',
            path: require.resolve('./components/ProductSubscription/SubscriptionOrders/EditSubscription')
        });
        return routes;
    });

    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        // registers our own overwrite plugin for webpack
        new moduleOverridePlugin(componentOverrideMapping).apply(compiler);
    });
};
