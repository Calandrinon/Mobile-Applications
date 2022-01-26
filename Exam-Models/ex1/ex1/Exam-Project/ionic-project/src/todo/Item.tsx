import React, {useEffect, useState} from 'react';
import {
    createAnimation,
    IonButton,
    IonCol,
    IonGrid,
    IonIcon,
    IonImg,
    IonItem,
    IonLabel,
    IonModal,
    IonRow
} from '@ionic/react';
import { ItemProps } from './ItemProps';
import {trashOutline} from "ionicons/icons";
import {deleteItem} from "./itemApi";
import {Storage} from "@capacitor/core";
import {Photo} from "../mediaContentHooks/usePhotoGallery";

interface ItemPropsExt extends ItemProps {
  onEdit: (_id?: string) => void;
  token: string;
}

const Item: React.FC<ItemPropsExt> = ({ _id, text, read, sender, created, onEdit, token}) => {
  return (
    <IonItem>
        <IonLabel>User {sender} [{created}]: {text}</IonLabel>
        <IonLabel>Read: {String(read)}</IonLabel>
    </IonItem>
  );
};

export default Item;
