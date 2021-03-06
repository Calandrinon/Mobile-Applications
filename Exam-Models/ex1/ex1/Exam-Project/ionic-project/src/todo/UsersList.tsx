import React, {useContext, useEffect, useState} from 'react';
import { RouteComponentProps } from 'react-router';
import {
    IonCol,
    IonContent,
    IonFab,
    IonFabButton, IonGrid,
    IonHeader,
    IonIcon,
    IonList, IonLoading,
    IonPage, IonRow,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import User from './User';
import { getLogger } from '../core';
import {getUserId, getUsers, logOff} from './userApi';
import {AuthContext} from "../auth";
import {UserProps} from "./UserProps";
import {useAppState} from "../statusHooks/useAppState";
import { updateUser } from "./userApi";
import {Storage} from "@capacitor/core";

const log = getLogger('UsersList');

/**
 * 1. Solve the local storage task for storing auth token and user ID
 * 2. Solve the user status task
 * **/

const UsersList: React.FC<RouteComponentProps> = ({ history }) => {
    const { token } = useContext(AuthContext);
    const dummyUserPropsArray: UserProps[] = []
    const [users, setUsers] = useState(dummyUserPropsArray);
    const { appState } = useAppState();
    const [ loggedUserId, setLoggedUserId ] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await getUsers(token);
            const userId = await Storage.get({key: "userId"});
            console.log("THIS IS THE RESPONSE CONTAINING THE USERS:");
            console.log(response);
            console.log("THIS IS THE RESPONSE CONTAINING THE USER ID:");
            console.log(userId);
            setUsers(response);
            setLoggedUserId(userId.value);
        };
        fetchUsers();
    }, []);

    log('render');

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="success">
                    <IonTitle>Users</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {users && (
                    <IonList>
                        { users && users.filter(user => {
                            console.log("UsersList: filter");
                            console.log("user._id:");
                            console.log(user._id);
                            console.log("userId:");
                            console.log(loggedUserId);
                            return user._id != loggedUserId;
                        }).map(({ _id, username, password, status}) =>
                            <User key={_id} _id={_id} username={username} password="" status={status} onRead={id => history.push(`/userChat/${id}/${username}`)} token={token}/>
                        )}
                    </IonList>
                )}
            </IonContent>
        </IonPage>
    );
};

export default UsersList;
