import {auth, getToken} from "@/firebase/firebaseClient";
import axios from "axios";

export const getMonthlyOverview = async (from: string, to: string) => {
    try {
        const token = await getToken()
        const res = await axios(
            {
                method: 'GET',
                url: '/api/v1/reports/overview/monthly?from=' + from + '&to=' + to,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return res.data;
    } catch (e) {
        throw e;
    }
}
export const getSalesReport = async (from:string, to:string) => {
    try {
        const token = await getToken()
        return await axios({
            method: 'GET',
            url: `/api/v1/reports/sales?fromDate=${from}&toDate=${to}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }catch (e){
        throw e;
    }
}
export const getDailyOverview = async () => {
    try {
        const token = await getToken()
        const res = await axios(
            {
                method: 'GET',
                url: '/api/v1/reports/overview/daily',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return res.data;
    } catch (e) {
        throw e;
    }
}
export const getStocksReport = async () => {
    try {
        const token = await getToken()
        const res = await axios(
            {
                method: 'GET',
                url: '/api/v1/reports/stock',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return res.data;
    } catch (e) {
        throw e;
    }
}

export const getCashReport = async (from: string, to: string) => {
    try {
        const token = await getToken()
        return axios(
            {
                method: 'GET',
                url: '/api/v1/reports/cash?from=' + from + '&to=' + to,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    } catch (e) {
        throw e;
    }
}

export const getExpenseReport = async (from: string, to: string) => {
    try {
        const token = await getToken()
        const res = await axios(
            {
                method: 'GET',
                url: '/api/v1/reports/expense?from=' + from + '&to=' + to,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return res.data;
    } catch (e) {
        throw e;
    }
}