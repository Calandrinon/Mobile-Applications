import React from 'react';
import styles from './MasterDetailList.module.css';
import {
    IonCheckbox,
    IonContent, IonInput,
    IonItem, IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonRadio, IonToggle
} from "@ionic/react";

const MasterDetailList: React.FC = () => {
    return (
        <IonContent>
            <IonList>
                <IonItemSliding>
                    <IonItem>
                        <IonLabel>Item</IonLabel>
                    </IonItem>
                    <IonItemOptions side="end">
                        <IonItemOption onClick={() => {}}>Mark as done</IonItemOption>
                    </IonItemOptions>
                    <IonItemOptions side="start">
                        <IonItemOption onClick={() => {}}>More details</IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>
            </IonList>
        </IonContent>
    );
};

export default MasterDetailList;
