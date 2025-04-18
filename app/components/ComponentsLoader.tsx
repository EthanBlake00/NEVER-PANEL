import React from 'react';
import {Box, CircularProgress, Typography} from "@mui/material";

const ComponentsLoader = ({title, position = "fixed"}: { title?: string, position: string }) => {
    return (
        <Box
            sx={{
                position: `${position}`,
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column", // Stack items vertically
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.8)", // Slightly more opaque
                backdropFilter: "blur(10px)", // More blur for a softer background
                zIndex: 99,
                padding: 2, // Add padding around the content
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Optional shadow for depth
                borderRadius: 2, // Rounded corners
            }}
        >
            {title && (
                <Typography
                    variant="h5" // Use h5 for a smaller title
                    sx={{
                        marginBottom: 2, // Space between title and loader
                        textAlign: "center", // Center text
                        fontWeight: 600, // Slightly bolder text
                        color: "text.primary", // Use theme color
                    }}
                >
                    {title}
                </Typography>
            )}
            <CircularProgress size="3rem" sx={{color: "primary.main"}}/> {/* Change color to match theme */}
        </Box>
    );
};

export default ComponentsLoader;
