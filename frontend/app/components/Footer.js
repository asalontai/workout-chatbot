import { Box, Typography } from "@mui/material";

export default function Footer() {
    return (
        <Box 
            component="footer"
            bgcolor="#2D2D2D"
            color="white"
            padding={2}
            textAlign="center"
            sx={{ position: 'realtive', marginTop: "auto", opacity: 0.8, }}
        >
            <Typography variant="body2">
                &copy; {new Date().getFullYear()} WorkoutAI. All rights reserved.
            </Typography>
        </Box>
    )
}