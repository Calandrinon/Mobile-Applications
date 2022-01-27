import React, { useContext, useEffect, useState } from 'react';
import {
    createAnimation,
    IonActionSheet,
    IonButton,
    IonButtons, IonCol,
    IonContent, IonFab, IonFabButton, IonGrid,
    IonHeader, IonIcon, IonImg,
    IonInput,
    IonLoading, IonModal,
    IonPage, IonRow, IonSelect, IonSelectOption,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import { RouteComponentProps } from 'react-router';
import { ItemProps } from './ItemProps';
import {Photo, usePhotoGallery} from "../mediaContentHooks/usePhotoGallery";
import {camera, closeOutline, trash} from "ionicons/icons";
import {createPhotos} from "../photos/photoApi";
import {AuthContext} from "../auth";
import {Storage} from "@capacitor/core";
import {useMyLocation} from "../location/useMyLocation";
import {MyMap} from "../location/MyMap";

const log = getLogger('ItemEdit');

interface ItemEditProps extends RouteComponentProps<{
  id?: string;
}> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
    const [showModal, setShowModal] = useState(false);
  const { items, saving, savingError, saveItem } = useContext(ItemContext);
  const {token} = useContext(AuthContext);
  const [name, setName] = useState('');
  const [productId, setProductId] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [version, setVersion] = useState(0);
  const [item, setItem] = useState<ItemProps>();
  let userId: string;

  useEffect(() => {
      (async () => {
          userId = (await Storage.get({key: "userId"})).value;
      })();
  }, []);

  useEffect( () => {
    log('useEffect');
    const routeId = match.params.id || '';
    const item = items?.find(it => it._id === routeId);

    setItem(item);
    if (item) {
      setName(item.name);
        setProductId(item.productId);
        setQuantity(item.quantity);
        setVersion(item.version);
    }
  }, [match.params.id, items]);

  const handleSave = async () => {
    const editedItem = { ...item, name, productId, quantity, version};
    console.log(editedItem);
    saveItem && saveItem(editedItem).then(() => history.goBack());
  };

    log('render');

  // @ts-ignore
    return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle>Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput value={name} onIonChange={e => setName(e.detail.value || '')} />
          <IonLoading isOpen={saving} />
          {savingError && (
          <div>{savingError.message || 'Failed to save item'}</div>
        )}
      </IonContent>
    </IonPage>
  );

};

export default ItemEdit;
