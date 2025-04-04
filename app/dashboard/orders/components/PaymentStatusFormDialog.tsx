import React, { useEffect, useState } from 'react';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { FormControl, MenuItem, Select, Stack } from "@mui/material";
import { paymentStatus, paymentStatusList } from "@/constant";
import CardActions from "@mui/material/CardActions";
import { PaymentStatus } from "@/functions/src/constant";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Order } from "@/interfaces";
import { updateAOrderAction } from "@/actions/ordersActions";
import { getOrders } from "@/lib/ordersSlice/ordersSlice";
import {useSnackbar} from "@/contexts/SnackBarContext";

const PaymentStatusFormDialog = ({ initialStatus, showForm, onClose }: {
    initialStatus: string;
    showForm: boolean;
    onClose: () => void;
}) => {
    const { selectedPage, size, selectedOrder } = useAppSelector(state => state.ordersSlice);
    const dispatch = useAppDispatch();
    const {showNotification} = useSnackbar();

    const [selectedStatus, setSelectedStatus] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);

    const updatePaymentStatus = async () => {
        try {
            setIsLoading(true);
            const updatedOrder: Order = {
                ...selectedOrder,
                updatedAt: new Date().toISOString(),
                paymentStatus: selectedStatus
            };
            await updateAOrderAction(updatedOrder);
            dispatch(getOrders({ size, page: selectedPage }));
            showNotification("Payment status updated successfully", "success");
        } catch (e) {
            console.error(e);
            showNotification(e.message, "error");
        } finally {
            setIsLoading(false);
            onClose();
        }
    };

    useEffect(() => {
        setSelectedStatus(initialStatus);
    }, [initialStatus]);

    return (
        <Dialog open={showForm} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", p: 2 }}>
                Payment Status
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <Stack direction="column" spacing={3}>
                    <FormControl fullWidth>
                        <Select
                            size={"small"}
                            labelId="payment-status-label"
                            value={selectedStatus}
                            onChange={(evt) => setSelectedStatus(evt.target.value as PaymentStatus)}
                            sx={{
                                py: 1,
                                borderRadius: "8px",
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#ccc",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#666",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "primary.main",
                                }
                            }}
                        >
                            {paymentStatusList.map((status) => (
                                <MenuItem
                                    key={status.id}
                                    value={status.value}
                                    disabled={status.value === paymentStatus.REFUNDED && selectedStatus === paymentStatus.REFUNDED}
                                >
                                    {status.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>

                <CardActions sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                    <Button
                        color="primary"
                        variant="contained"
                        disabled={isLoading}
                        onClick={onClose}
                        sx={{
                            minWidth: 100,
                            py: 1,
                            borderRadius: "8px",
                            "&:hover": { backgroundColor: "#e0e0e0" },
                        }}
                    >
                        Close
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={updatePaymentStatus}
                        disabled={
                            selectedStatus === selectedOrder?.paymentStatus || isLoading
                        }
                        sx={{
                            "&:disabled": { opacity: 0.6, cursor: "not-allowed" }
                        }}
                    >
                        Update
                    </Button>
                </CardActions>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentStatusFormDialog;
