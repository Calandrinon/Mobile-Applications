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
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [item, setItem] = useState<ItemProps>();
  const { photos, takePhoto, deletePhoto, getSavedPhoto } = usePhotoGallery();
  const oldPhotos = JSON.parse(JSON.stringify(photos));
  const [photoToDelete, setPhotoToDelete] = useState<Photo>();
  const myLocation = useMyLocation();
  const { latitude: lat, longitude: lng } = myLocation.position?.coords || {}
    let [targetLatitude, setLatitude] = useState(item?.latitude);
    let [targetLongitude, setLongitude] = useState(item?.longitude);
  let userId: string;

  useEffect(simpleAnimation, []);

  useEffect(() => {
      (async () => {
          userId = (await Storage.get({key: "userId"})).value;
      })();
      console.log(`Effect latitude and longitude: ${targetLatitude} ${targetLongitude}`);
      console.log(`item is:`);
      console.log(item);
      console.log("item latitude:");
      console.log(item?.latitude);
      console.log("item longitude:");
      console.log(item?.longitude);
  }, []);

  useEffect( () => {
    log('useEffect');
    const routeId = match.params.id || '';
    const item = items?.find(it => it._id === routeId);

    setItem(item);
    if (item) {
      setText(item.text);
      setCategory(item.category);
      setLatitude(item.latitude);
      setLongitude(item.longitude);
    }
  }, [match.params.id, items]);

  const handleSave = async () => {
    const editedItem = { ...item, text, category, latitude: targetLatitude, longitude: targetLongitude};
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
        <IonInput value={text} onIonChange={e => setText(e.detail.value || '')} />
          <IonLoading isOpen={saving} />
          {savingError && (
          <div>{savingError.message || 'Failed to save item'}</div>
        )}
      </IonContent>
    </IonPage>
  );

    function onClick() {
        return (e: any) => {
            console.log(`latlng:`);
            console.log(`latitude: ${e.latLng.lat()}`);
            console.log(`longitude: ${e.latLng.lng()}`);
            setItem({_id: item?._id, text: String(item?.text), category: String(item?.category), latitude: e.latLng.lat(), longitude: e.latLng.lng()});
            setLatitude(e.latLng.lat());
            setLongitude(e.latLng.lng());
        }
    }

    function simpleAnimation() {
        const el = document.querySelector('.photoButton');
        if (el) {
            const animation = createAnimation()
                .addElement(el)
                .duration(1000)
                .direction('alternate')
                .iterations(Infinity)
                .keyframes([
                    { offset: 0, transform: 'scale(1.25)', opacity: '1' },
                    {
                        offset: 1, transform: 'scale(1)', opacity: '0.5'
                    }
                ]);
            animation.play();
        }
    }
};

export default ItemEdit;
