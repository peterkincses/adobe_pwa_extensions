/*  @todo: these are here temporarily only; they should be moved to the module's directory;
    see bug https://github.com/magento/pwa-studio/issues/2770#issuecomment-713847184 */

const { Targetables } = require('@magento/pwa-buildpack')

module.exports = targets => {
    const targetables = Targetables.using(targets);

    //@todo: investigate if item.js can be removed from src folder
    const MiniCartItemComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/MiniCart/ProductList/item.js'
    );
    const CartItemComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/CartPage/ProductListing/product.js'
    );
    const PersonalisationCartDetails = CartItemComponent.addImport(
        "PersonalisationCartDetails from '@bat/product-personalisation/src/components/MiniCart/ProductList/personalisationDetails.js'"
    );

    MiniCartItemComponent.insertBeforeJSX(
        '<span className={classes.quantity}>',
        `<${PersonalisationCartDetails} personalisation={props.personalisation}/>`
    );

    CartItemComponent.insertBeforeJSX(
        '<span className={classes.price}>',
        `<${PersonalisationCartDetails} personalisation={item.personalisation}/>`
    );
}
