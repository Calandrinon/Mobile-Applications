import axios from 'axios';
import { authConfig, baseUrl, getLogger, withLogs } from '../core';
import { ProductProps } from './ItemProps';

const productUrl = `http://${baseUrl}/api/product`;
const synchronizationUrl = productUrl + '/synchronize';

export const getProducts: (token: string) => Promise<ProductProps[]> = token => {
    return withLogs(axios.get(productUrl, authConfig(token)), 'getProducts');
}

export const createProduct: (token: string, item: ProductProps) => Promise<ProductProps[]> = (token, item) => {
    return withLogs(axios.post(productUrl, item, authConfig(token)), 'createProduct');
}

export const updateProduct: (token: string, item: ProductProps) => Promise<ProductProps[]> = (token, item) => {
    return withLogs(axios.put(`${productUrl}/${item._id}`, item, authConfig(token)), 'updateProduct');
}

export const sendNewOfflineDataToServer: (token: string, items: ProductProps[]) => Promise<ProductProps[]> = (token, items) => {
    return withLogs(axios.post(synchronizationUrl, items, authConfig(token)), 'sendNewOfflineDataToServer');
}

export const deleteProduct: (token: string, itemId: string) => Promise<ProductProps> = (token, itemId) => {
    return withLogs(axios.delete(`${productUrl}/${itemId}`, authConfig(token)), 'deleteProduct');
}

interface MessageData {
    type: string;
    payload: ProductProps;
}

const log = getLogger('ws');

export const newWebSocket = (token: string, onMessage: (data: MessageData) => void) => {
    const ws = new WebSocket(`ws://${baseUrl}`);
    ws.onopen = () => {
        log('web socket onopen');
        ws.send(JSON.stringify({ type: 'authorization', payload: { token } }));
    };
    ws.onclose = () => {
        log('web socket onclose');
    };
    ws.onerror = error => {
        log('web socket onerror', error);
    };
    ws.onmessage = messageEvent => {
        log('web socket onmessage');
        console.log(`From itemApi.tsx: data = ${messageEvent.data}`);
        onMessage(JSON.parse(messageEvent.data));
    };
    return () => {
        ws.close();
    }
}
