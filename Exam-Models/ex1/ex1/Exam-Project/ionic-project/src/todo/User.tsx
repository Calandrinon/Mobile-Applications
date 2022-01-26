import React from 'react';
import {IonCol, IonIcon, IonItem, IonLabel} from '@ionic/react';
import { UserProps } from './UserProps';

interface UserPropsExt extends UserProps {
    onRead: (_id?: string) => void;
    token: string;
}

const User: React.FC<UserPropsExt> = ({ _id, username, password, onRead, status, token}) => {
    return (
        <IonItem>
            <IonLabel onClick={() => onRead(_id)}>User {username}</IonLabel>
        </IonItem>
    );
};

export default User;
