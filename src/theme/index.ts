import { createTheme } from "@mantine/core";
import colors from "./purple";

export const theme = createTheme({
    colors: {
        colors,
    },
    shadows: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        lg: "0 1px 5px 0 rgba(0, 0, 0, 0.15)",
        xl: "0 1px 10px 0 rgba(0, 0, 0, 0.2)",
        "2xl": "0 1px 15px 0 rgba(0, 0, 0, 0.25)",
        "3xl": "0 1px 20px 0 rgba(0, 0, 0, 0.3)",
    },
    defaultRadius: "md",
});
