import React, {useEffect, useState} from 'react';
import {Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField} from '@mui/material';
import Typography from "@mui/material/Typography";
import {IoAdd, IoRefreshCircle} from "react-icons/io5";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {
    getOrders,
    setLoading,
    setOrders,
    setSelectedFilterStatus,
    setSelectedFilterTracking,
    setSelectedPayment
} from "@/lib/ordersSlice/ordersSlice";
import {getAlgoliaClient} from "@/lib/algoliaConfig";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {getOrdersByDate} from "@/actions/ordersActions";
import PaymentTable from "@/app/dashboard/paymentAndShipping/components/PaymentTable";
import PaymentMethodForm from "@/app/dashboard/paymentAndShipping/components/PaymentMethodForm";
import {PaymentMethod} from "@/interfaces";
import {paymentStatusList} from "@/constant";

const OrdersHeader = () => {
    const dispatch = useAppDispatch();
    const {currentUser} = useAppSelector(state => state.authSlice);
    const {selectedPage, size,selectedFilterStatus,selectedFilterTracking} = useAppSelector(state => state.ordersSlice);

    const onSearch = async (evt) => {
        try {
            dispatch(setLoading(true))
            evt.preventDefault();
            const search = evt.target.search.value;
            const client = getAlgoliaClient();
            const searchResults = await client.search({
                requests: [{indexName: "orders_index", query: search}]
            });
            const getDate = (date) => {
                return new Date(date).toLocaleString()
            }
            const orders = searchResults.results[0].hits.map(order => {
                return {
                    ...order,
                    createdAt: getDate(order.createdAt)
                }
            })
            dispatch(setOrders(orders))
        } catch (e) {
            console.error(e)
        } finally {
            dispatch(setLoading(false))
        }
    }
    const onDatePick = async (date) => {
        try {
            dispatch(setLoading(true))
            if (date) {
                const d = date.toDate().toLocaleString()
                const orders = await getOrdersByDate(d);
                dispatch(setOrders(orders))
            }
        } catch (e) {
            console.error(e)
        } finally {
            dispatch(setLoading(false))
        }
    }

    useEffect(() => {
        if (currentUser) {
            dispatch(getOrders({size, page: selectedPage}))
        }
    }, [currentUser,selectedFilterTracking,selectedFilterStatus]);
    return (
        <Stack direction="column" spacing={2} alignItems="start" flexWrap={"wrap"} justifyContent="space-between" p={2}>
            <Stack>
                <Stack>
                    <Typography
                        variant={"h5"}
                    >
                        Options
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={5} alignItems="center" justifyContent="space-between" py={2}
                       flexWrap={"wrap"}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormControl variant="outlined" size="small">
                            <InputLabel id="Status-label">Status</InputLabel>
                            <Select
                                placeholder={"Status"}
                                labelId="Status-label"
                                label="Status"
                                value={selectedFilterStatus}
                                onChange={(e) => dispatch(setSelectedFilterStatus(e.target.value))}
                                defaultValue="all"
                            >
                                <MenuItem value={"all"} key="all">All</MenuItem>
                                {paymentStatusList.map((status) => (
                                    <MenuItem
                                        key={status.id}
                                        value={status.value}
                                    >
                                        {status.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* Filter Dropdown */}
                        <FormControl variant="outlined" size="small">
                            <InputLabel id="Tracking-label">Track</InputLabel>
                            <Select
                                placeholder={"Track"}
                                labelId="Track-label"
                                label="Track"
                                value={selectedFilterTracking}
                                onChange={(e) => dispatch(setSelectedFilterTracking(e.target.value))}
                                defaultValue="all" // Ensure a default value is set
                            >
                                <MenuItem value={"all"} key="all">All</MenuItem>
                                <MenuItem value="processing">Processing</MenuItem>
                                <MenuItem value="shipped">Shipped</MenuItem>
                                <MenuItem value="complete">Complete</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap={"wrap"}>
                        {/* Search TextField */}
                        <form onSubmit={onSearch}>
                            <Stack gap={2} display={"flex"} direction={"row"} flexWrap={"wrap"}>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    placeholder="Search orders..."
                                    name={"search"}
                                />
                                <Button type={"submit"} variant="contained" color="primary">
                                    Search
                                </Button>
                            </Stack>
                        </form>
                        <IconButton onClick={() => dispatch(getOrders({size, page: selectedPage}))}>
                            <IoRefreshCircle size={30}/>
                        </IconButton>
                    </Stack>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date"
                            onChange={onDatePick}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default OrdersHeader;
