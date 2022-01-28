import React, {useCallback, useContext, useEffect, useReducer, useState} from 'react';
import PropTypes from 'prop-types';
import {getLogger} from '../core';
import {TaskProps} from './TaskProps';
import {createTask, getTasks, newWebSocket, sendNewOfflineDataToServer, updateTask} from './TaskApi';
import {AuthContext} from '../auth';
import {Network, Storage} from "@capacitor/core";
import {useNetwork} from "../statusHooks/useNetwork";
import {useAppState} from "../statusHooks/useAppState";

const log = getLogger('TaskProvider');

type SaveTaskFn = (task: TaskProps) => Promise<any>;

export interface TasksState {
    tasks?: TaskProps[],
    fetching: boolean,
    fetchingError?: Error | null,
    saving: boolean,
    savingError?: Error | null,
    saveTask?: SaveTaskFn,
}

interface ActionProps {
    type: string,
    payload?: any,
}

const initialState: TasksState = {
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

const reducer: (state: TasksState, action: ActionProps) => TasksState =
    (state, {type, payload}) => {
        switch (type) {
            case FETCH_ITEMS_STARTED:
                return {...state, fetching: true, fetchingError: null};
            case FETCH_ITEMS_SUCCEEDED:
                return {...state, tasks: payload.tasks, fetching: false};
            case FETCH_ITEMS_FAILED:
                return {...state, fetchingError: payload.error, fetching: false};
            case SAVE_ITEM_STARTED:
                return {...state, savingError: null, saving: true};
            case SAVE_ITEM_SUCCEEDED:
                const tasks = [...(state.tasks || [])];
                const task = payload.task;
                const index = tasks.findIndex(it => it._id === task._id);
                if (index === -1) {
                    tasks.splice(0, 0, task);
                } else {
                    tasks[index] = task;
                }
                return {...state, tasks, saving: false};
            case SAVE_ITEM_FAILED:
                return {...state, savingError: payload.error, saving: false};
            default:
                return state;
        }
    };

export const TaskContext = React.createContext<TasksState>(initialState);

interface TaskProviderProps {
    children: PropTypes.ReactNodeLike,
}

export const TaskProvider: React.FC<TaskProviderProps> = ({children}) => {
    const {token} = useContext(AuthContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    const {tasks, fetching, fetchingError, saving, savingError} = state;

    useEffect(() => {
        Network.addListener('networkStatusChange', async (status) => {
            if (status.connected) {
                let localStorageTasks = JSON.parse((await Storage.get({key: "savedTasks"})).value);
                console.log("NETWORK STATUS CHANGE EFFECT");
                console.log(localStorageTasks);
                let response = await sendNewOfflineDataToServer(token, localStorageTasks);
                console.log("SERVER RESPONSE WITH UPDATED DATA:");
                console.log(response);
            } else {
                alert("Your internet connection is off. All tasks created are saved in the local storage and synchronized when the connection is restored.");
            }
        });
    }, []);

    useEffect(getTasksEffect, [token]);
    useEffect(wsEffect, [token]);
    const saveTask = useCallback<SaveTaskFn>(saveTaskCallback, [token]);
    const value = {tasks, fetching, fetchingError, saving, savingError, saveTask};

    log('returns');

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );


    function getTasksEffect() {
        let canceled = false;
        fetchTasks();
        return () => {
            canceled = true;
        }

        async function fetchTasks() {
            if (!token?.trim()) {
                return;
            }
            try {
                log('fetchTasks started');
                let tasks;
                if (navigator.onLine) {
                    dispatch({type: FETCH_ITEMS_STARTED});
                    tasks = await getTasks(token);
                    await Storage.set({key: "savedTasks", value: JSON.stringify(tasks)});
                } else {
                    tasks = await Storage.get({key: "savedTasks"});
                    tasks = JSON.parse(tasks.value);
                }
                log('fetchTasks succeeded');
                if (!canceled) {
                    dispatch({type: FETCH_ITEMS_SUCCEEDED, payload: {tasks}});
                }
            } catch (error) {
                log('fetchTasks failed');
                dispatch({type: FETCH_ITEMS_FAILED, payload: {error}});
            }
        }
    }

    async function saveTaskCallback(task: TaskProps) {
        try {
            log('saveTask started');
            dispatch({type: SAVE_ITEM_STARTED});
            let savedTask;
            if (navigator.onLine) {
                savedTask = await (task._id ? updateTask(token, task) : createTask(token, task));
            } else {
                let userId = await Storage.get({key: "userId"});
                savedTask = {...task, userId: userId.value};
                let savedTasks = JSON.parse((await Storage.get({key: "savedTasks"})).value);
                savedTasks.push(savedTask);
                await Storage.set({key: "savedTasks", value: JSON.stringify(savedTasks)});
            }
            dispatch({type: SAVE_ITEM_SUCCEEDED, payload: {task: savedTask}});
            log('saveTask succeeded');
        } catch (error) {
            log('saveTask failed');
            dispatch({type: SAVE_ITEM_FAILED, payload: {error}});
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
                const {type, payload: task} = message;
                let parsedTaskJSON = JSON.parse(JSON.stringify(task));
                log(`ws message, task ${type}`);
                if (type === 'created' || type === 'updated') {
                    dispatch({type: SAVE_ITEM_SUCCEEDED, payload: {task}});
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
