import axios from 'axios';
import {authConfig, baseUrl, getLogger, withLogs} from '../core';
import {ProductProps} from './ProductProps';

const productUrl = `http://${baseUrl}/api/product`;
const synchronizationUrl = productUrl + '/synchronize';

export const getProducts: (token: string) => Promise<ProductProps[]> = token => {
    return withLogs(axios.get(productUrl, authConfig(token)), 'getProducts');
}

export const createProduct: (token: string, product: ProductProps) => Promise<ProductProps[]> = (token, product) => {
    return withLogs(axios.post(productUrl, product, authConfig(token)), 'createProduct');
}

export const updateProduct: (token: string, product: ProductProps) => Promise<ProductProps[]> = (token, product) => {
    return withLogs(axios.put(`${productUrl}/${product._id}`, product, authConfig(token)), 'updateProduct');
}

export const sendNewOfflineDataToServer: (token: string, products: ProductProps[]) => Promise<ProductProps[]> = (token, products) => {
    return withLogs(axios.post(synchronizationUrl, products, authConfig(token)), 'sendNewOfflineDataToServer');
}

export const deleteProduct: (token: string, productId: string) => Promise<ProductProps> = (token, productId) => {
    return withLogs(axios.delete(`${productUrl}/${productId}`, authConfig(token)), 'deleteProduct');
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
        ws.send(JSON.stringify({type: 'authorization', payload: {token}}));
    };
    ws.onclose = () => {
        log('web socket onclose');
    };
    ws.onerror = error => {
        log('web socket onerror', error);
    };
    ws.onmessage = messageEvent => {
        log('web socket onmessage');
        console.log(`From productApi.tsx: data = ${messageEvent.data}`);
        onMessage(JSON.parse(messageEvent.data));
    };
    return () => {
        ws.close();
    }
}
