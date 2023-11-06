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
const { Targetables } = require('@magento/pwa-buildpack')

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const Header = targetables.reactComponent(
        'src/components/Header/header.js'
    );
    const YotiHeaderNotice = Header.addImport(
        "YotiAgeVerificationHeaderNotice from 'src/@bat/yoti/src/components/Yoti/Header/Notice'"
    );

    Header.insertBeforeJSX(
        '<header />',
        `<${YotiHeaderNotice}/>`
    );

    const CreateAccountPage = targetables.reactComponent(
        '@magento/venia-ui/lib/components/CreateAccountPage/createAccountPage.js'
    );
    const YotiBrowserSupportNotice = CreateAccountPage.addImport(
        "YotiBrowserSupportNotice from 'src/@bat/yoti/src/components/Yoti/BrowserSupportNotice'"
    );

    CreateAccountPage.insertBeforeJSX(
        '<CreateAccountForm />',
        `<${YotiBrowserSupportNotice}/>`
    );
};
