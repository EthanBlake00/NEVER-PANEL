"use client";
import {baselightTheme} from "@/utils/theme/DefaultColors";
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import StoreProvider from "@/components/StoreProvider";
import { SnackbarProvider } from "@/contexts/SnackBarContext";
import {ConfirmationDialogProvider} from "@/contexts/ConfirmationDialogContext";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>
        <StoreProvider>
            <SnackbarProvider>
                <ConfirmationDialogProvider>
                    <ThemeProvider theme={baselightTheme}>
                        <CssBaseline/>
                        {children}
                    </ThemeProvider>
                </ConfirmationDialogProvider>
            </SnackbarProvider>
        </StoreProvider>
        </body>
        </html>
    );
}
