import React from 'react';
import {IonIcon, IonItem, IonLabel} from '@ionic/react';
import { UserProps } from './UserProps';

const User: React.FC<UserProps> = ({ _id, username}) => {
    return (
        <IonItem>
            <IonLabel>{username}</IonLabel>
        </IonItem>
    );
};

export default User;
