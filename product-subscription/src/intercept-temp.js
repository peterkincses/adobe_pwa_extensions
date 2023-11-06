/*  @todo: these are here temporarily only; they should be moved to the module's directory;
    see bug https://github.com/magento/pwa-studio/issues/2770#issuecomment-713847184 */

const { Targetables } = require('@magento/pwa-buildpack')

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const SubscriptionSelector = "SubscriptionSelector from 'src/@bat/product-subscription/src/components/ProductSubscription/Selector/subscriptionSelector.js'";
    const SubscriptionInfoModal = "SubscriptionInfoModal from 'src/@bat/product-subscription/src/components/ProductSubscription/InfoModal'";

    /**
     * All pages
     */

    const MainComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/Main/main.js'
    );

    const InfoModalForAllPages = MainComponent.addImport(
        SubscriptionInfoModal
    );

    MainComponent.appendJSX(
        '<main className={rootClass}>',
        `<${InfoModalForAllPages} componentProps={props}/>`
    );

    /**
     * PDP
     */
    const ProductFullDetail = targetables.reactComponent(
        'src/components/ProductFullDetail/productFullDetail.js'
    );

    const SubscriptionSelectorForPdp = ProductFullDetail.addImport(
        SubscriptionSelector
    );

    ProductFullDetail.insertBeforeJSX(
        '<section className={classes.quantity}>',
        `<${SubscriptionSelectorForPdp} componentProps={props} component="productFullDetail" />`
    );

    /**
     *  Product grid/list
     */
    const ProductCompactDetail = targetables.reactComponent(
        'src/components/ProductCompactDetail/productCompactDetail.js'
    );

    const SubscriptionSelectorForPlp = ProductCompactDetail.addImport(
        SubscriptionSelector
    );

    ProductCompactDetail.insertAfterJSX(
        '<section className={classes.options}>',
        `<${SubscriptionSelectorForPlp} componentProps={props} component="productCompactDetail" />`
    );

    /**
     * Cart Item
     */
    const CartItemComponent = targetables.reactComponent(
        'src/components/CartPage/ProductListing/product.js'
    );

    const SubscriptionSelectorForCartItem = CartItemComponent.addImport(
        SubscriptionSelector
    );

    CartItemComponent.insertBeforeJSX(
        '<span className={classes.price}>',
        `<${SubscriptionSelectorForCartItem} componentProps={props} component="cartItem"/>`
    );
}
