import { createStyles } from "@mantine/core";

const useStyles = createStyles(theme => ({
    bar: {
        [`@media (max-width: ${theme.breakpoints.xl}px)`]: {
            "--side-nav-width": "20%",
        },
        [`@media (max-width: ${theme.breakpoints.lg}px)`]: {
            "--side-nav-width": "25%",
        },
        [`@media (max-width: ${theme.breakpoints.md}px)`]: {
            ".item-label": {
                display: "none",
            },
            "--side-nav-width": "75px",
        },
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            ".item-label": {
                display: "none",
            },
            "--side-nav-width": "75px",
        },
    },
    sidebar: {
        [`@media (max-width: ${theme.breakpoints.md}px)`]: {
            "--side-nav-width": "25% !important",
        },
    }
}))
export default useStyles