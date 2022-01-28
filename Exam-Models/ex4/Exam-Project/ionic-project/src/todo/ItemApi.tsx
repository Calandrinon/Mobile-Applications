import axios from 'axios';
import { authConfig, baseUrl, getLogger, withLogs } from '../core';
import { ItemProps } from './ItemProps';

const itemUrl = `http://${baseUrl}/api/item`;
const synchronizationUrl = itemUrl + '/synchronize';

export const getItems: (token: string) => Promise<ItemProps[]> = token => {
  return withLogs(axios.get(itemUrl, authConfig(token)), 'getItems');
}

export const createItem: (token: string, item: ItemProps) => Promise<ItemProps[]> = (token, item) => {
  return withLogs(axios.post(itemUrl, item, authConfig(token)), 'createItem');
}

export const updateItem: (token: string, item: ItemProps) => Promise<ItemProps[]> = (token, item) => {
  return withLogs(axios.put(`${itemUrl}/${item._id}`, item, authConfig(token)), 'updateItem');
}

export const sendNewOfflineDataToServer: (token: string, items: ItemProps[]) => Promise<ItemProps[]> = (token, items) => {
  return withLogs(axios.post(synchronizationUrl, items, authConfig(token)), 'sendNewOfflineDataToServer');
}

export const deleteItem: (token: string, itemId: string) => Promise<ItemProps> = (token, itemId) => {
  return withLogs(axios.delete(`${itemUrl}/${itemId}`, authConfig(token)), 'deleteItem');
}

interface MessageData {
  type: string;
  payload: ItemProps;
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
