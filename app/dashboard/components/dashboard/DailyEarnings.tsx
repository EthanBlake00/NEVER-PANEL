"use client";
import {Box, CircularProgress, Typography} from "@mui/material";
import DashboardCard from "../shared/DashboardCard";
import {useEffect, useState} from "react";
import {useAppSelector} from "@/lib/hooks";
import {getDailyOverview} from "@/actions/reportsAction"; // Ensure the correct path to your interfaces

const DailyEarnings = () => {
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0)
    const [invoiceCount, setInvoiceCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const {currentUser} = useAppSelector(state => state.authSlice);

    useEffect(() => {
        if (currentUser) {
            fetchDailyEarnings();
        }
    }, [currentUser]);

    const fetchDailyEarnings = async () => {
        try {
            const overview = await getDailyOverview();
            setTotalEarnings(overview.totalEarnings);
            setTotalProfit(overview.totalProfit);
            setInvoiceCount(overview.totalOrders);
            setTotalDiscount(overview.totalDiscount)
        } catch (error) {
            console.error("Error fetching daily earnings:", error.message, error.stack);
        } finally {
            setLoading(false);
        }
    };
    return (
        <DashboardCard
            title={`Daily Summery(${invoiceCount}) *Fee Excl*`}
        >
            {loading ? (
                <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100px"}}>
                    <CircularProgress/>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                >
                    <Box mt={2} sx={{
                        display: "flex",
                        gap: 3,
                        flexDirection: "column"
                    }}>
                        <Typography variant="h4" fontWeight="600" mt="-20px">
                            <span>Sale: </span> LKR {totalEarnings.toFixed(2)}
                        </Typography>
                        <Typography variant="h4" fontWeight="600" mt="-20px">
                            <span>Discount: </span> -LKR {totalDiscount.toFixed(2)}
                        </Typography>
                        <Typography variant="h4" fontWeight="600" mt="-20px">
                            <span>Net Sale:</span> LKR {(totalEarnings-totalDiscount).toFixed(2)}
                        </Typography>
                        <Typography variant="h4" fontWeight="600" mt="-20px">
                            <span>Profit: </span> LKR {totalProfit.toFixed(2)}
                        </Typography>
                    </Box>
                </Box>
            )}
        </DashboardCard>
    );
};

export const dynamic = 'force-dynamic';
export default DailyEarnings;
