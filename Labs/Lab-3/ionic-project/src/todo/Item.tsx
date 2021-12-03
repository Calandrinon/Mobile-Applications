import React, {useEffect, useState} from 'react';
import {IonButton, IonCol, IonGrid, IonIcon, IonImg, IonItem, IonLabel, IonModal, IonRow} from '@ionic/react';
import { ItemProps } from './ItemProps';
import {trashOutline} from "ionicons/icons";
import {deleteItem} from "./itemApi";
import {Storage} from "@capacitor/core";
import {Photo} from "../mediaContentHooks/usePhotoGallery";

interface ItemPropsExt extends ItemProps {
  onEdit: (_id?: string) => void;
  token: string;
}

const Item: React.FC<ItemPropsExt> = ({ _id, text, category, onEdit, token}) => {
    const [showModal, setShowModal] = useState(false);
    const [photos, setPhotos] = useState<Photo[]>([]);
    useEffect(() => {
        Storage.get({key: "photos"})
            .then((photosJson) => {
                setPhotos(JSON.parse(photosJson.value));
            });
    }, []);

  return (
    <IonItem>
        <IonLabel onClick={() => onEdit(_id)}>{text}</IonLabel>

        <IonModal isOpen={showModal} backdropDismiss={false} cssClass='my-custom-class'>
            <IonGrid>
                <IonRow>
                    {photos.filter((photo) => _id == photo.itemId).map((photo, index) => (
                        <IonCol size="6" key={index}>
                            <IonImg src={photo.webviewPath}/>
                        </IonCol>
                    ))}
                </IonRow>
            </IonGrid>
            <IonButton color="success" onClick={() => setShowModal(false)}>Close modal</IonButton>
        </IonModal>
        <IonButton color="success" onClick={() => setShowModal(true)}>Images</IonButton>

        <IonButton color="success" onClick={() => deleteItem(token, String(_id))}>
            <IonIcon slot="start" icon={trashOutline}/>
        </IonButton>
    </IonItem>
  );
};

export default Item;
