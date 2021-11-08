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
import { getUsers } from './userApi';
import {AuthContext} from "../auth";
import {UserProps} from "./UserProps";

const log = getLogger('UsersList');

const UsersList: React.FC<RouteComponentProps> = ({ history }) => {
    const { token } = useContext(AuthContext);
    const dummyUserPropsArray: UserProps[] = []
    const [users, setUsers] = useState(dummyUserPropsArray);
    //let users = getUsers(token).then(result => result);
    useEffect(() => {
        const fetchUsers = async () => {
            const response = await getUsers(token);
            console.log("THIS IS THE RESPONSE CONTAINING THE USERS:");
            console.log(response);
            setUsers(response);
        };
        fetchUsers();
    }, []);
    console.log("These are the users:");
    console.log(users);
    log('render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="success">
                    <IonTitle>Users</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <h1>Users list component</h1>
                {users && (
                    <IonList>
                        { users && users.map(({ _id, username}) =>
                            <User key={_id} _id={_id} username={username}/>)}
                    </IonList>
                )}
            </IonContent>
        </IonPage>
    );
};

export default UsersList;
