import React from 'react';
import {IonButton, IonIcon, IonItem, IonLabel} from '@ionic/react';
import { ItemProps } from './ItemProps';
import {trashOutline} from "ionicons/icons";
import {deleteItem} from "./itemApi";

interface ItemPropsExt extends ItemProps {
  onEdit: (_id?: string) => void;
  token: string;
}

const Item: React.FC<ItemPropsExt> = ({ _id, text, category, onEdit, token}) => {
  return (
    <IonItem>
        <IonLabel onClick={() => onEdit(_id)}>{text}</IonLabel>
        <IonButton color="success" onClick={() => deleteItem(token, String(_id))}>
            <IonIcon slot="start" icon={trashOutline}/>
        </IonButton>
    </IonItem>
  );
};

export default Item;
