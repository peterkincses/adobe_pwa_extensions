const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    if (
        typeof global.eswRetailerDisplayConfiguration != 'undefined' &&
        true ===
            global.eswRetailerDisplayConfiguration.template.extensions
                .headerPromotions.enabled
    ) {
        const targetables = Targetables.using(targets);

        const headerComponent = targetables.reactComponent(
            '@eshopworld/bc-americaneagle/src/components/Header/header.js'
        );

        headerComponent.addImport(
            "HeaderPromotions from '@eshopworld/header-promotions'"
        );

        headerComponent.insertBeforeSource(
            `</Fragment>`,
            `<HeaderPromotions />\n`
        );
    }
};
