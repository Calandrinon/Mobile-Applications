import React, {useContext, useEffect, useState} from 'react';
import {
    createAnimation,
    IonActionSheet,
    IonButton,
    IonButtons, IonCol,
    IonContent, IonFab, IonFabButton, IonGrid,
    IonHeader, IonIcon, IonImg,
    IonInput,
    IonLoading, IonModal,
    IonPage, IonRow, IonSelect, IonSelectOption,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import {getLogger} from '../core';
import {TaskContext} from './TaskProvider';
import {RouteComponentProps} from 'react-router';
import {TaskProps} from './TaskProps';
import {Photo, usePhotoGallery} from "../mediaContentHooks/usePhotoGallery";
import {camera, closeOutline, trash} from "ionicons/icons";
import {createPhotos} from "../photos/photoApi";
import {AuthContext} from "../auth";
import {Storage} from "@capacitor/core";
import {useMyLocation} from "../location/useMyLocation";
import {MyMap} from "../location/MyMap";

const log = getLogger('TaskEdit');

interface TaskEditProps extends RouteComponentProps<{
    id?: string;
}> {
}

const TaskEdit: React.FC<TaskEditProps> = ({history, match}) => {
    const [showModal, setShowModal] = useState(false);
    const {tasks, saving, savingError, saveTask} = useContext(TaskContext);
    const {token} = useContext(AuthContext);
    const [text, setText] = useState('');
    const [status, setStatus] = useState('');
    const [version, setVersion] = useState(0);
    const [task, setTask] = useState<TaskProps>();
    const {photos, takePhoto, deletePhoto, getSavedPhoto} = usePhotoGallery();
    const oldPhotos = JSON.parse(JSON.stringify(photos));
    const [photoToDelete, setPhotoToDelete] = useState<Photo>();
    const myLocation = useMyLocation();
    const {latitude: lat, longitude: lng} = myLocation.position?.coords || {}
    let userId: string;

    useEffect(() => {
        (async () => {
            userId = (await Storage.get({key: "userId"})).value;
        })();
    }, []);

    useEffect(() => {
        log('useEffect');
        const routeId = match.params.id || '';
        const task = tasks?.find(it => it._id === routeId);

        setTask(task);
        if (task) {
            setText(task.text);
        }
    }, [match.params.id, tasks]);

    const handleSave = async () => {
        const editedTask = {...task, text, status, version};
        console.log(editedTask);
        /**
        Storage.get({key: "photos"}).then((photosJson) => {
            let photos = JSON.parse(photosJson.value);
            if (!!photos) {
                createPhotos(token, photosToUpload);
            }
        });
        **/
        saveTask && saveTask(editedTask).then(() => history.goBack());
    };

    log('render');

// @ts-ignore
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="success">
                    <IonTitle>Edit</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleSave}>
                            Save
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonInput value={text} onIonChange={e => setText(e.detail.value || '')}/>

                <IonLoading isOpen={saving}/>
                {savingError && (
                    <div>{savingError.message || 'Failed to save task'}</div>
                )}
            </IonContent>
        </IonPage>
    );

};

export default TaskEdit;
