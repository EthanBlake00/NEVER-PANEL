import React, {useEffect, useState} from "react";
import {Order, Tracking} from "@/interfaces";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {Button, Grid, MenuItem, Select, TextField} from "@mui/material";
import {orderStatus} from "@/constant";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {updateAOrderAction} from "@/actions/ordersActions";
import {getOrders} from "@/lib/ordersSlice/ordersSlice";
import {useSnackbar} from "@/contexts/SnackBarContext";

const TrackingFormDialog = ({
                                tracking,
                                showForm,
                                onFormClose,
                            }: {
    tracking: Tracking | null;
    showForm: boolean;
    onFormClose: () => void;
}) => {
    const [formData, setFormData] = useState({
        partner: "",
        trackingNumber: "",
        trackingUrl: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const {selectedOrder} = useAppSelector(state => state.ordersSlice);
    const [status, setStatus] = useState(tracking?.status as orderStatus);
    const {showNotification} = useSnackbar();


    const dispatch = useAppDispatch();
    const {selectedPage, size} = useAppSelector(state => state.ordersSlice);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        if (tracking) {
            const updatedTracking: Tracking = {
                ...tracking,
                status: status,
                updatedAt: new Date().toISOString(),
            };

            const updatedOrder: Order = {
                ...selectedOrder,
                tracking: updatedTracking,
            };

            try {
                await updateAOrderAction(updatedOrder);
                dispatch(getOrders({size, page: selectedPage}))
                showNotification("Tracking information updated successfully", "success");
            } catch (e) {
                console.log(e);
                showNotification(e.message, "error");
            } finally {
                setIsLoading(false);
                onFormClose();
            }
        } else {
            if (!formData.partner || !formData.trackingNumber || !formData.trackingUrl) {
                showNotification("Please fill all fields", "warning");
                return;
            }

            const newTracking: Tracking = {
                trackingCompany: formData.partner,
                trackingNumber: formData.trackingNumber,
                trackingUrl: formData.trackingUrl,
                status: orderStatus.SHIPPED,
                updatedAt: new Date().toLocaleString(),
            };

            const updatedOrder: Order = {
                ...selectedOrder,
                tracking: newTracking,
            };

            try {
                setIsLoading(true);
                await updateAOrderAction(updatedOrder);
                setFormData({
                    partner: "",
                    trackingNumber: "",
                    trackingUrl: "",
                });
                dispatch(getOrders({size, page: selectedPage}))
                showNotification("Tracking information added successfully", "success");
            } catch (e) {
                console.log(e);
                showNotification(e.message, "error");
            } finally {
                setIsLoading(false);
                onFormClose();
            }
        }
    };
    const onClose = () => {
        setFormData({
            partner: "",
            trackingNumber: "",
            trackingUrl: "",
        });
        onFormClose();
    }

    useEffect(() => {
        setStatus(tracking?.status as orderStatus);
    }, [tracking])

    return (
        <Dialog open={showForm} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {tracking ? "Tracking Details" : "Add Tracking Information"}
            </DialogTitle>
            <DialogContent>
                {tracking ? (
                    <Card variant="outlined">
                        <CardContent>
                            <Typography>
                                <strong>Carrier:</strong> {tracking.trackingCompany}
                            </Typography>
                            <Typography>
                                <strong>Tracking Number:</strong> {tracking.trackingNumber}
                            </Typography>
                            <Typography>
                                <strong>Tracking URL:</strong>{" "}
                                <a
                                    href={tracking.trackingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {tracking.trackingUrl}
                                </a>
                            </Typography>
                            <Box mt={2}>
                                <Select defaultValue={tracking.status as orderStatus} value={status} fullWidth
                                        onChange={(event) => setStatus(event.target.value as orderStatus)}>
                                    <MenuItem
                                        value={orderStatus.SHIPPED}
                                        disabled={selectedOrder?.tracking?.status === orderStatus.CANCELLED || selectedOrder?.tracking?.status === orderStatus.SHIPPED}
                                    >
                                        {orderStatus.SHIPPED}
                                    </MenuItem>
                                    <MenuItem
                                        value={orderStatus.CANCELLED}
                                    >
                                        {orderStatus.CANCELLED}
                                    </MenuItem>
                                    <MenuItem value={orderStatus.COMPLETED} disabled={
                                        selectedOrder?.tracking?.status === orderStatus.CANCELLED || selectedOrder?.tracking?.status === orderStatus.COMPLETED
                                    }>
                                        {orderStatus.COMPLETED}
                                    </MenuItem>
                                </Select>
                            </Box>

                        </CardContent>
                    </Card>
                ) : (
                    <form>
                        <Grid container spacing={2} mt={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Partner"
                                    name="partner"
                                    value={formData.partner}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Tracking Number"
                                    name="trackingNumber"
                                    value={formData.trackingNumber}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Tracking URL"
                                    name="trackingUrl"
                                    value={formData.trackingUrl}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    </form>
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={isLoading}
                    className={"disabled:bg-opacity-60 disabled:cursor-not-allowed"}
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Save
                </Button>
                <Button
                    disabled={isLoading}
                    className={"disabled:bg-opacity-60 disabled:cursor-not-allowed"}
                    variant="outlined"
                    color="secondary"
                    onClick={onFormClose}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TrackingFormDialog;
