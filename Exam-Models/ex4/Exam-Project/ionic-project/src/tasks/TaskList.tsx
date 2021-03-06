import React, {useContext, useEffect} from 'react';
import {RouteComponentProps} from 'react-router';
import {
    createAnimation,
    IonButton, IonButtons,
    IonCol,
    IonContent,
    IonFab,
    IonFabButton, IonGrid,
    IonHeader,
    IonIcon,
    IonList, IonLoading, IonMenuButton,
    IonPage, IonRow,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import {add} from 'ionicons/icons';
import Task from './Task';
import {getLogger} from '../core';
import {TaskContext} from './TaskProvider';
import {useAppState} from "../statusHooks/useAppState";
import {AuthContext} from "../auth";
import {Storage} from "@capacitor/core";
import {updateUserStatus} from "./userApi";
import {useNetwork} from "../statusHooks/useNetwork";
import {deleteTask} from "./TaskApi";
import AnimationDemo from "../animations/AnimationDemo";

const log = getLogger('TaskList');

const TaskList: React.FC<RouteComponentProps> = ({history}) => {
    const {tasks, fetching, fetchingError} = useContext(TaskContext);
    const {appState} = useAppState();
    const {logout, token} = useContext(AuthContext);
    let networkStatus = useNetwork();

    useEffect(simpleAnimation, []);

    function simpleAnimation() {
        const el = document.querySelector('.animatedButton');
        if (el) {
            const animation = createAnimation()
                .addElement(el)
                .duration(1000)
                .direction('alternate')
                .iterations(Infinity)
                .keyframes([
                    {offset: 0, transform: 'scale(1.25)', opacity: '1'},
                    {
                        offset: 1, transform: 'scale(1)', opacity: '0.5'
                    }
                ]);
            animation.play();
        }
    }

    console.log("Current app state:");
    console.log(appState);
    log('render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="success">
                    <IonTitle>
                        Exam - {networkStatus.networkStatus.connected ? "Online" : "Offline"}
                    </IonTitle>
                    <IonButton slot="end" color="medium" onClick={async () => {
                        let userId = await Storage.get({key: "userId"});
                        let token = await Storage.get({key: "token"});
                        await updateUserStatus(userId.value, token.value, false);
                        logout?.();
                    }}>Log off</IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen={fetching} message="Fetching tasks"/>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <h1>Exam tasks</h1>
                            {tasks && (
                                <IonList>
                                    {tasks.map((task) =>
                                        <Task key={task._id} _id={task._id} text={task.text} status={task.status} version={task.version}
                                              onEdit={id => history.push(`/task/${id}`)} token={token}/>)}
                                </IonList>
                            )}
                        </IonCol>
                    </IonRow>
                </IonGrid>

                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch tasks'}</div>
                )}
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => history.push('/task')} color="dark" className="animatedButton">
                        <IonIcon icon={add}/>
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default TaskList;
