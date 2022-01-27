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
  token: string;
}

const Item: React.FC<ItemPropsExt> = ({ _id, text, read, sender, created, token}) => {
    let date = new Date(created);
  return (
    <IonItem>
        <IonLabel>User {sender} [{`${date.getDay()}-${date.getMonth()+1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`}]: {text}</IonLabel>
        <IonLabel>Read: {String(read)}</IonLabel>
    </IonItem>
  );
};

export default Item;
