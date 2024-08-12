import { Box, Typography } from "@mui/material";

export default function Footer() {
    return (
        <Box 
            component="footer"
            bgcolor="#2D2D2D"
            color="white"
            padding={1}
            textAlign="center"
            sx={{ position: 'realtive', marginTop: "auto" }}
        >
            <Typography variant="body2">
                &copy; {new Date().getFullYear()} WorkoutAI. All rights reserved.
            </Typography>
        </Box>
    )
}