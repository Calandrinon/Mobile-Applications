import React, { useContext, useEffect, useState } from 'react';
import {
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
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [item, setItem] = useState<ItemProps>();
  const { photos, takePhoto, deletePhoto, getSavedPhoto } = usePhotoGallery();
  const oldPhotos = JSON.parse(JSON.stringify(photos));
  const [photoToDelete, setPhotoToDelete] = useState<Photo>();
  const myLocation = useMyLocation();
  const { latitude: lat, longitude: lng } = myLocation.position?.coords || {}
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
      setText(item.text);
    }
  }, [match.params.id, items]);

  const handleSave = async () => {
    const editedItem = { ...item, text, category};
    console.log(editedItem);
    Storage.get({key: "photos"}).then((photosJson) => {
        let photos = JSON.parse(photosJson.value);
        if (!!photos) {
            let photosToUpload = photos.filter((photo: any) => oldPhotos.indexOf(photo) < 0);
            createPhotos(token, photosToUpload);
        }
    });
    saveItem && saveItem(editedItem).then(() => history.goBack());
  };

    log('render');

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
        <IonInput value={text} onIonChange={e => setText(e.detail.value || '')} />
        <IonSelect value={category} placeholder="Select One" onIonChange={e => setCategory(e.detail.value)}>
          <IonSelectOption value="Do">Do</IonSelectOption>
          <IonSelectOption value="Decide">Decide</IonSelectOption>
          <IonSelectOption value="Delegate">Delegate</IonSelectOption>
          <IonSelectOption value="Delete">Delete</IonSelectOption>
        </IonSelect>
          <IonModal isOpen={showModal} backdropDismiss={false} cssClass='my-custom-class'>
              <MyMap
                  lat={lat}
                  lng={lng}
                  onMapClick={log('onMap')}
                  onMarkerClick={log('onMarker')}
              />
              <IonButton color="success" onClick={() => setShowModal(false)}>Close modal</IonButton>
          </IonModal>
          <IonButton color="success" onClick={() => setShowModal(true)}>Select location</IonButton>

          <IonLoading isOpen={saving} />
          {savingError && (
          <div>{savingError.message || 'Failed to save item'}</div>
        )}
          <IonGrid>
              <IonRow>
                  {photos.filter((photo) => item?._id == photo.itemId).map((photo, index) => (
                      <IonCol size="6" key={index}>
                          <IonImg onClick={() => setPhotoToDelete(photo)}
                                  src={photo.webviewPath}/>
                      </IonCol>
                  ))}
              </IonRow>
          </IonGrid>
          <IonFab vertical="bottom" horizontal="center" slot="fixed">
              <IonFabButton onClick={() => {
                  takePhoto(item?._id);
              }} color="success">
                  <IonIcon icon={camera}/>
              </IonFabButton>
          </IonFab>
          <IonActionSheet
              isOpen={!!photoToDelete}
              buttons={[{
                  text: 'Delete',
                  role: 'destructive',
                  icon: trash,
                  handler: () => {
                      if (photoToDelete) {
                          deletePhoto(photoToDelete);
                          setPhotoToDelete(undefined);
                      }
                  }
              }, {
                  text: 'Cancel',
                  icon: closeOutline,
                  role: 'cancel'
              }]}
              onDidDismiss={() => setPhotoToDelete(undefined)}
          />
      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
