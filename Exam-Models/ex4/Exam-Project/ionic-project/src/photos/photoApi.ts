import axios from 'axios';
import { authConfig, baseUrl, getLogger, withLogs } from '../core';
import { PhotoProps } from './PhotoProps';

const photoUrl = `http://${baseUrl}/api/photo`;
const synchronizationUrl = photoUrl + '/synchronize';

export const getPhotos: (token: string) => Promise<PhotoProps[]> = token => {
    return withLogs(axios.get(photoUrl, authConfig(token)), 'getPhotos');
}

export const createPhotos: (token: string, photos: PhotoProps[]) => Promise<PhotoProps[]> = (token, photos) => {
    return withLogs(axios.post(photoUrl, photos, authConfig(token)), 'createPhoto');
}

export const updatePhoto: (token: string, photo: PhotoProps) => Promise<PhotoProps[]> = (token, photo) => {
    return withLogs(axios.put(`${photoUrl}/${photo._id}`, photo, authConfig(token)), 'updatePhoto');
}

export const sendNewOfflineDataToServer: (token: string, photos: PhotoProps[]) => Promise<PhotoProps[]> = (token, photos) => {
    return withLogs(axios.post(synchronizationUrl, photos, authConfig(token)), 'sendNewOfflineDataToServer');
}

export const deletePhoto: (token: string, photoId: string) => Promise<PhotoProps> = (token, photoId) => {
    return withLogs(axios.delete(`${photoUrl}/${photoId}`, authConfig(token)), 'deletePhoto');
}

interface MessageData {
    type: string;
    payload: PhotoProps;
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
        console.log(`From photoApi.tsx: data = ${messageEvent.data}`);
        onMessage(JSON.parse(messageEvent.data));
    };
    return () => {
        ws.close();
    }
}

export {}