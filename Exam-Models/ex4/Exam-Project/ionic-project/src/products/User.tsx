import React from 'react';
import {IonCol, IonIcon, IonItem, IonLabel} from '@ionic/react';
import {UserProps} from './UserProps';

const User: React.FC<UserProps> = ({_id, username, password, status}) => {
    let statusAsText: string = status ? "Online" : "Offline / Away";

    return (
        <IonItem>
            <IonLabel>{username}</IonLabel>
            <IonLabel>{statusAsText}</IonLabel>
        </IonItem>
    );
};

export default User;
