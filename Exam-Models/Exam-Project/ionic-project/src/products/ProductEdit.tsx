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
import { ProductContext } from './ProductProvider';
import { RouteComponentProps } from 'react-router';
import { ProductProps } from './ProductProps';
import {Photo, usePhotoGallery} from "../mediaContentHooks/usePhotoGallery";
import {camera, closeOutline, trash} from "ionicons/icons";
import {createPhotos} from "../photos/photoApi";
import {AuthContext} from "../auth";
import {Storage} from "@capacitor/core";
import {useMyLocation} from "../location/useMyLocation";
import {MyMap} from "../location/MyMap";

const log = getLogger('ProductEdit');

interface ProductEditProps extends RouteComponentProps<{
id?: string;
}> {}

const ProductEdit: React.FC<ProductEditProps> = ({ history, match }) => {
const [showModal, setShowModal] = useState(false);
const { products, saving, savingError, saveProduct } = useContext(ProductContext);
const {token} = useContext(AuthContext);
const [text, setText] = useState('');
const [category, setCategory] = useState('');
const [product, setProduct] = useState<ProductProps>();
const { photos, takePhoto, deletePhoto, getSavedPhoto } = usePhotoGallery();
const oldPhotos = JSON.parse(JSON.stringify(photos));
const [photoToDelete, setPhotoToDelete] = useState<Photo>();
const myLocation = useMyLocation();
const { latitude: lat, longitude: lng } = myLocation.position?.coords || {}
let [targetLatitude, setLatitude] = useState(product?.latitude);
let [targetLongitude, setLongitude] = useState(product?.longitude);
let userId: string;

useEffect(simpleAnimation, []);

useEffect(() => {
(async () => {
userId = (await Storage.get({key: "userId"})).value;
})();
console.log(`Effect latitude and longitude: ${targetLatitude} ${targetLongitude}`);
console.log(`product is:`);
console.log(product);
console.log("product latitude:");
console.log(product?.latitude);
console.log("product longitude:");
console.log(product?.longitude);
}, []);

useEffect( () => {
log('useEffect');
const routeId = match.params.id || '';
const product = products?.find(it => it._id === routeId);

setProduct(product);
if (product) {
setText(product.text);
setCategory(product.category);
setLatitude(product.latitude);
setLongitude(product.longitude);
}
}, [match.params.id, products]);

const handleSave = async () => {
const editedProduct = { ...product, text, category, latitude: targetLatitude, longitude: targetLongitude};
console.log(editedProduct);
Storage.get({key: "photos"}).then((photosJson) => {
let photos = JSON.parse(photosJson.value);
if (!!photos) {
let photosToUpload = photos.filter((photo: any) => oldPhotos.indexOf(photo) < 0);
createPhotos(token, photosToUpload);
}
});
saveProduct && saveProduct(editedProduct).then(() => history.goBack());
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
<IonSelect value={category} placeholder="Select One" onIonChange={e => setCategory(e.detail.value)}>
<IonSelectOption value="Do">Do</IonSelectOption>
<IonSelectOption value="Decide">Decide</IonSelectOption>
<IonSelectOption value="Delegate">Delegate</IonSelectOption>
<IonSelectOption value="Delete">Delete</IonSelectOption>
</IonSelect>
<IonModal isOpen={showModal} backdropDismiss={false} cssClass='my-custom-class'>
<MyMap lat={lat} lng={lng} targetLat={targetLatitude} targetLng={targetLongitude} onMapClick={onClick()} onMarkerClick={log('onMarker')}/>
<IonButton color="success" onClick={() => setShowModal(false)}>Close modal</IonButton>
</IonModal>
<IonButton color="success" onClick={() => setShowModal(true)}>Select location</IonButton>

<IonLoading isOpen={saving} />
{savingError && (
<div>{savingError.message || 'Failed to save product'}</div>
)}
<IonGrid>
<IonRow>
{photos.filter((photo) => product?._id == photo.itemId).map((photo, index) => (
<IonCol size="6" key={index}>
<IonImg onClick={() => setPhotoToDelete(photo)}
src={photo.webviewPath}/>
</IonCol>
))}
</IonRow>
</IonGrid>
<IonFab vertical="bottom" horizontal="center" slot="fixed">
<IonFabButton onClick={() => {
takePhoto(product?._id);
}} color="success" className="photoButton">
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

function onClick() {
return (e: any) => {
console.log(`latlng:`);
console.log(`latitude: ${e.latLng.lat()}`);
console.log(`longitude: ${e.latLng.lng()}`);
setProduct({_id: product?._id, text: String(product?.text), category: String(product?.category), latitude: e.latLng.lat(), longitude: e.latLng.lng()});
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

export default ProductEdit;
