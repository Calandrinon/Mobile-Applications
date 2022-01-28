import React, {useContext, useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import {RouteComponentProps} from 'react-router';
import {
    IonButton,
    IonRow,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonInput,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar,
    IonIcon,
    useIonViewWillEnter,
    IonCard,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSelect,
    IonSelectOption, IonSearchbar, IonList, IonItem
} from '@ionic/react';
import {getLogger} from '../core';
import {useNetwork} from "../statusHooks/useNetwork";
import {baseUrl} from "../core";
import {getTask, getTasks} from "./TaskApi";
import {AuthContext} from "../auth";
import {TaskProps} from "./TaskProps";
import Task from "./Task";

const log = getLogger('Login');

export const TasksSearch: React.FC<RouteComponentProps> = ({history}) => {
    const [tasks, setTasks] = useState<TaskProps[]>([]);
    const { token, username, password } = useContext(AuthContext);
    const [searchTask, setSearchTask] = useState<string>('');
    const networkStatus = useNetwork();

    async function fetchTasks() {
        const tasks: TaskProps[] = await getTasks(token);
        setTasks(tasks);
    }

    useIonViewWillEnter(async () => {
        await fetchTasks();
    });

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="success">
                    <IonTitle>Search tasks</IonTitle>
                    <h3 slot="end">{networkStatus.networkStatus.connected ? "Online" : "Offline"}</h3>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonSearchbar
                    value={searchTask}
                    debounce={1000}
                    onIonChange={e => setSearchTask(e.detail.value!)}>
                </IonSearchbar>
                {!networkStatus.networkStatus.connected &&
                    <h3>Your connection is down. The quotes cannot be displayed.</h3>
                }
                <IonList>
                    {searchTask.length > 0 && tasks
                        .filter((task: TaskProps) => !!task && task.text.indexOf(searchTask) >= 0)
                        .map((task: TaskProps) => <IonItem key={task._id}>Text: {task.text}; Status: {task.status}; Version: {task.version}</IonItem>)}
                </IonList>
            </IonContent>
        </IonPage>
    );
};
