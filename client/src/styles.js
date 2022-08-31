import { createStyles } from "@mantine/core";

const useStyles = createStyles(theme => ({
    bar: {
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            ".item-label": {
                display: "none",
            },
            "--side-nav-width": "75px",
        },
        // "@media (max-width: 700px)": {
        //     ".item-label": {
        //         display: "none",
        //     },
        //     svg: {
        //         width: 25,
        //         height: 25,
        //     },
        //     "--side-nav-width": "60px",
        // },
        // [`@media (max-width: ${theme.breakpoints.lg}px)`]: {
        //     "--side-nav-width": "200px",
        // },
    }
}))
export default useStyles