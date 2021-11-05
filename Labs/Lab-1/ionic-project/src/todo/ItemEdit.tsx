import React, { useContext, useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonLoading,
  IonPage, IonSelect, IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import { RouteComponentProps } from 'react-router';
import { ItemProps } from './ItemProps';

const log = getLogger('ItemEdit');

interface ItemEditProps extends RouteComponentProps<{
  id?: string;
}> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
  const { items, saving, savingError, saveItem } = useContext(ItemContext);
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [item, setItem] = useState<ItemProps>();
  useEffect(() => {
    log('useEffect');
    const routeId = match.params.id || '';
    const item = items?.find(it => it._id === routeId);
    setItem(item);
    if (item) {
      setText(item.text);
    }
  }, [match.params.id, items]);
  const handleSave = () => {
    const editedItem = { ...item, text, category};
    console.log(editedItem);
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
        <IonLoading isOpen={saving} />
        {savingError && (
          <div>{savingError.message || 'Failed to save item'}</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
