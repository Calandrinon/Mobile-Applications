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

const Item: React.FC<ItemPropsExt> = ({ _id, name, productId, quantity, version, onEdit, token}) => {
    const [showModal, setShowModal] = useState(false);

  return (
    <IonItem>
        <IonLabel onClick={() => onEdit(_id)}>Product name: {name}</IonLabel>
        <IonLabel onClick={() => onEdit(_id)}>Quantity: {quantity}</IonLabel>

        <IonButton color="success" onClick={() => deleteItem(token, String(_id))}>
            <IonIcon slot="start" icon={trashOutline}/>
        </IonButton>
    </IonItem>
  );
};

export default Item;
