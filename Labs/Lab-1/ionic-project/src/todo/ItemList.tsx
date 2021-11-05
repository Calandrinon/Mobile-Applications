import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonCol,
  IonContent,
  IonFab,
  IonFabButton, IonGrid,
  IonHeader,
  IonIcon,
  IonList, IonLoading,
  IonPage, IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { add } from 'ionicons/icons';
import Item from './Item';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';

const log = getLogger('ItemList');

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError } = useContext(ItemContext);
  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Item List</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={fetching} message="Fetching items"/>
        <IonGrid>
          <IonRow>
            <IonCol>
                {items && (
                    <IonList>
                      {items.map(({ _id, text }) =>
                          <Item key={_id} _id={_id} text={text} onEdit={id => history.push(`/item/${id}`)}/>)}
                    </IonList>
                )}
            </IonCol>
            <IonCol>
              {items && (
                  <IonList>
                    {items.map(({ _id, text }) =>
                        <Item key={_id} _id={_id} text={text} onEdit={id => history.push(`/item/${id}`)}/>)}
                  </IonList>
              )}
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              {items && (
                  <IonList>
                    {items.map(({ _id, text }) =>
                        <Item key={_id} _id={_id} text={text} onEdit={id => history.push(`/item/${id}`)}/>)}
                  </IonList>
              )}
            </IonCol>
            <IonCol>
              {items && (
                  <IonList>
                    {items.map(({ _id, text }) =>
                        <Item key={_id} _id={_id} text={text} onEdit={id => history.push(`/item/${id}`)}/>)}
                  </IonList>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>

        {fetchingError && (
          <div>{fetchingError.message || 'Failed to fetch items'}</div>
        )}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/item')} color="dark">
            <IonIcon icon={add}/>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ItemList;
