import React, {useCallback, useContext, useEffect, useReducer, useState} from 'react';
import PropTypes from 'prop-types';
import { getLogger } from '../core';
import { ProductProps } from './ProductProps';
import {createProduct, getProducts, newWebSocket, sendNewOfflineDataToServer, updateProduct} from './ProductApi';
import { AuthContext } from '../auth';
import {Network, Storage} from "@capacitor/core";
import {useNetwork} from "../statusHooks/useNetwork";
import {useAppState} from "../statusHooks/useAppState";

const log = getLogger('ProductProvider');

type SaveProductFn = (product: ProductProps) => Promise<any>;

export interface ProductsState {
products?: ProductProps[],
fetching: boolean,
fetchingError?: Error | null,
saving: boolean,
savingError?: Error | null,
saveProduct?: SaveProductFn,
}

interface ActionProps {
type: string,
payload?: any,
}

const initialState: ProductsState = {
fetching: false,
saving: false,
};

const FETCH_ITEMS_STARTED = 'FETCH_ITEMS_STARTED';
const FETCH_ITEMS_SUCCEEDED = 'FETCH_ITEMS_SUCCEEDED';
const FETCH_ITEMS_FAILED = 'FETCH_ITEMS_FAILED';
const SAVE_ITEM_STARTED = 'SAVE_ITEM_STARTED';
const SAVE_ITEM_SUCCEEDED = 'SAVE_ITEM_SUCCEEDED';
const SAVE_ITEM_FAILED = 'SAVE_ITEM_FAILED';
const DELETE_ITEM_FAILED = 'DELETE_ITEM_FAILED';
const DELETE_ITEM_SUCCEEDED = 'DELETE_ITEM_SUCCEEDED';

const reducer: (state: ProductsState, action: ActionProps) => ProductsState =
(state, { type, payload }) => {
switch (type) {
case FETCH_ITEMS_STARTED:
return { ...state, fetching: true, fetchingError: null };
case FETCH_ITEMS_SUCCEEDED:
return { ...state, products: payload.products, fetching: false };
case FETCH_ITEMS_FAILED:
return { ...state, fetchingError: payload.error, fetching: false };
case SAVE_ITEM_STARTED:
return { ...state, savingError: null, saving: true };
case SAVE_ITEM_SUCCEEDED:
const products = [...(state.products || [])];
const product = payload.product;
const index = products.findIndex(it => it._id === product._id);
if (index === -1) {
products.splice(0, 0, product);
} else {
products[index] = product;
}
return { ...state, products, saving: false };
case SAVE_ITEM_FAILED:
return { ...state, savingError: payload.error, saving: false };
default:
return state;
}
};

export const ProductContext = React.createContext<ProductsState>(initialState);

interface ProductProviderProps {
children: PropTypes.ReactNodeLike,
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
const { token } = useContext(AuthContext);
const [state, dispatch] = useReducer(reducer, initialState);
const { products, fetching, fetchingError, saving, savingError } = state;

useEffect(() => {
Network.addListener('networkStatusChange', async (status) => {
if (status.connected) {
let localStorageProducts = JSON.parse((await Storage.get({key: "savedTasks"})).value);
console.log("NETWORK STATUS CHANGE EFFECT");
console.log(localStorageProducts);
let response = await sendNewOfflineDataToServer(token, localStorageProducts);
console.log("SERVER RESPONSE WITH UPDATED DATA:");
console.log(response);
} else {
alert("Your internet connection is off. All products created are saved in the local storage and synchronized when the connection is restored.");
}
});
}, []);

useEffect(getProductsEffect, [token]);
useEffect(wsEffect, [token]);
const saveProduct = useCallback<SaveProductFn>(saveProductCallback, [token]);
const value = { products, fetching, fetchingError, saving, savingError, saveProduct };

log('returns');

return (
<ProductContext.Provider value={value}>
{children}
</ProductContext.Provider>
);


function getProductsEffect() {
let canceled = false;
fetchProducts();
return () => {
canceled = true;
}

async function fetchProducts() {
if (!token?.trim()) {
return;
}
try {
log('fetchProducts started');
let products;
if (navigator.onLine) {
dispatch({ type: FETCH_ITEMS_STARTED });
products = await getProducts(token);
await Storage.set({key: "savedTasks", value: JSON.stringify(products)});
} else {
products = await Storage.get({key: "savedTasks"});
products = JSON.parse(products.value);
}
log('fetchProducts succeeded');
if (!canceled) {
dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { products } });
}
} catch (error) {
log('fetchProducts failed');
dispatch({ type: FETCH_ITEMS_FAILED, payload: { error } });
}
}
}

async function saveProductCallback(product: ProductProps) {
try {
log('saveProduct started');
dispatch({ type: SAVE_ITEM_STARTED });
let savedProduct;
if (navigator.onLine) {
savedProduct = await (product._id ? updateProduct(token, product) : createProduct(token, product));
} else {
let userId = await Storage.get({key: "userId"});
savedProduct = {...product, userId: userId.value};
let savedTasks = JSON.parse((await Storage.get({key: "savedTasks"})).value);
savedTasks.push(savedProduct);
await Storage.set({key: "savedTasks", value: JSON.stringify(savedTasks)});
}
dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { product: savedProduct } });
log('saveProduct succeeded');
} catch (error) {
log('saveProduct failed');
dispatch({ type: SAVE_ITEM_FAILED, payload: { error } });
}
}

function wsEffect() {
let canceled = false;
log('wsEffect - connecting');
let closeWebSocket: () => void;
if (token?.trim()) {
closeWebSocket = newWebSocket(token, message => {
if (canceled) {
return;
}
const { type, payload: product } = message;
let parsedProductJSON = JSON.parse(JSON.stringify(product));
log(`ws message, product ${type}`);
if (type === 'created' || type === 'updated') {
dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { product } });
}
});
}
return () => {
log('wsEffect - disconnecting');
canceled = true;
closeWebSocket?.();
}
}
};
