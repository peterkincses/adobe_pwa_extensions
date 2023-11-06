import React, {Fragment} from "react";

const PersonalisationFonts = props => {
    const {
        psnState,
        fonts
    } = props;

    const fontDeclarations = fonts.map(font => (
        `@font-face {
              font-family: '${font.font_name}';
              font-style: normal;
              font-weight: 400;
              font-display: swap;
              src: url('${font.font}') format('woff');
           }
           .${font.font_name.toLowerCase().replace(/\s/g, '')} {
               font-family: '${font.font_name}';
           }
        `
    ));

    const fontDeclarationsForDemo =
        `@font-face {
        font-family: 'Droid';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('/static-assets/fonts/personalisation/droid.woff') format('woff');
    }
        .droid {
            font-family: 'Droid';
        }
        @font-face {
            font-family: 'Arabella';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url('/static-assets/fonts/personalisation/arabella.woff') format('woff');
        }
        .arabella {
            font-family: 'Arabella';
        }
        @font-face {
            font-family: 'Flustered Brush Two';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url('/static-assets/fonts/personalisation/Fusterd_Brush_Two.woff') format('woff');
        }
        .flusteredbrushtwo {
            font-family: 'Flustered Brush Two';
        }
        @font-face {
            font-family: 'Honeyscript';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url('/static-assets/fonts/personalisation/HoneyScript-Light.woff') format('woff');
        }
        .honeyscript {
            font-family: 'Honeyscript';
        }
        `;


    return (
        <Fragment>
            <style>
                {fontDeclarations}
            </style>
        </Fragment>
    );
}

export default PersonalisationFonts;
