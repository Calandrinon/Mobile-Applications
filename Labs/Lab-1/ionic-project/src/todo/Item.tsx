import React from 'react';
import {IonButton, IonIcon, IonItem, IonLabel} from '@ionic/react';
import { ItemProps } from './ItemProps';
import {trashOutline} from "ionicons/icons";

interface ItemPropsExt extends ItemProps {
  onEdit: (_id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ _id, text, category, onEdit }) => {
  return (
    <IonItem onClick={() => onEdit(_id)}>
        <IonLabel>{text}</IonLabel>
        <IonButton color="success">
            <IonIcon slot="start" icon={trashOutline}></IonIcon>
        </IonButton>
    </IonItem>
  );
};

export default Item;
