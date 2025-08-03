// src/lib/theme.ts
import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

export const theme = extendTheme({
    config: {
        initialColorMode: "light",
        useSystemColorMode: false,
    }as ThemeConfig,
    fonts: {
        heading: `'Nunito', sans-serif`,
        body: `'Nunito', sans-serif`,
    },
    styles: {
        global: {
            "@keyframes glow": {
                "0%": { boxShadow: "0 0 5px green" },
                "5%": { boxShadow: "0 0 20px green" },
                "100%": { boxShadow: "0 0 5px green" },
            }
        }
    },
    layerStyles: {
        glow: {
            animation: "glow 1s ease-in-out 2 alternate",
        }
    }
});
