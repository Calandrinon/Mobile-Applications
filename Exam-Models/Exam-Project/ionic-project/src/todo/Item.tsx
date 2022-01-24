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

const Item: React.FC<ItemPropsExt> = ({ _id, text, category, onEdit, token}) => {
    const [showModal, setShowModal] = useState(false);
    const [photos, setPhotos] = useState<Photo[]>([]);
    useEffect(() => {
        Storage.get({key: "photos"})
            .then((photosJson) => {
                setPhotos(JSON.parse(photosJson.value));
            });
    }, []);

    const enterAnimation = (baseEl: any) => {
        const wrapperAnimation = createAnimation()
            .addElement(baseEl.querySelector('.modal-wrapper')!)
            .keyframes([
                { offset: 0, opacity: '0', transform: 'scale(0)' },
                { offset: 1, opacity: '1', transform: 'scale(1)' }
            ]);

        return createAnimation()
            .addElement(baseEl)
            .easing('ease-out')
            .duration(500)
            .addAnimation([wrapperAnimation]);
    }

    const leaveAnimation = (baseEl: any) => {
        return enterAnimation(baseEl).direction('reverse');
    }

  return (
    <IonItem>
        <IonLabel onClick={() => onEdit(_id)}>{text}</IonLabel>

        <IonModal isOpen={showModal} backdropDismiss={false} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation} cssClass='my-custom-class'>
            <IonGrid>
                <IonRow>
                    {!!photos && photos.filter((photo) => _id == photo.itemId).map((photo, index) => (
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
