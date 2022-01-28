import axios from 'axios';
import {authConfig, baseUrl, getLogger, withLogs} from '../core';
import {TaskProps} from './TaskProps';

const taskUrl = `http://${baseUrl}/api/task`;
const synchronizationUrl = taskUrl + '/synchronize';

export const getTasks: (token: string) => Promise<TaskProps[]> = token => {
    return withLogs(axios.get(taskUrl, authConfig(token)), 'getTask');
}

export const getTask: (query: string, token: string) => Promise<TaskProps[]> = (query, token) => {
    return withLogs(axios.get(taskUrl + "?q=" + query, authConfig(token)), 'getTask');
}

export const createTask: (token: string, task: TaskProps) => Promise<TaskProps[]> = (token, task) => {
    return withLogs(axios.post(taskUrl, task, authConfig(token)), 'createTask');
}

export const updateTask: (token: string, task: TaskProps) => Promise<TaskProps[]> = (token, task) => {
    return withLogs(axios.put(`${taskUrl}/${task._id}`, task, authConfig(token)), 'updateTask');
}

export const sendNewOfflineDataToServer: (token: string, tasks: TaskProps[]) => Promise<TaskProps[]> = (token, tasks) => {
    return withLogs(axios.post(synchronizationUrl, tasks, authConfig(token)), 'sendNewOfflineDataToServer');
}

export const deleteTask: (token: string, taskId: string) => Promise<TaskProps> = (token, taskId) => {
    return withLogs(axios.delete(`${taskUrl}/${taskId}`, authConfig(token)), 'deleteTask');
}

interface MessageData {
    type: string;
    payload: TaskProps;
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
        console.log(`From taskApi.tsx: data = ${messageEvent.data}`);
        onMessage(JSON.parse(messageEvent.data));
    };
    return () => {
        ws.close();
    }
}
