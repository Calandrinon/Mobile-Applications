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
  console.log(`Items: ${JSON.stringify(items)}`);
  console.log(items);
  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle>Tasks</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={fetching} message="Fetching items"/>
        <IonGrid>
          <IonRow>
            <IonCol>
                <h1>Do</h1>
                {items && (
                    <IonList>
                      {items.filter((item => item.category === "Do")).map(({ _id, text , category}) =>
                          <Item key={_id} _id={_id} text={text} category={category} onEdit={id => history.push(`/item/${id}`)}/>)}
                    </IonList>
                )}
            </IonCol>
            <IonCol>
              <h1>Decide</h1>
              {items && (
                  <IonList>
                    {items.filter((item => item.category === "Decide")).map(({ _id, text, category}) =>
                        <Item key={_id} _id={_id} text={text} category={category} onEdit={id => history.push(`/item/${id}`)}/>)}
                  </IonList>
              )}
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <h1>Delegate</h1>
              {items && (
                  <IonList>
                    {items.filter((item => item.category === "Delegate")).map(({ _id, text , category}) =>
                        <Item key={_id} _id={_id} text={text} category={category} onEdit={id => history.push(`/item/${id}`)}/>)}
                  </IonList>
              )}
            </IonCol>
            <IonCol>
              <h1>Delete</h1>
              {items && (
                  <IonList>
                    {items.filter((item => item.category === "Delete")).map(({ _id, text, category}) =>
                        <Item key={_id} _id={_id} text={text} category={category} onEdit={id => history.push(`/item/${id}`)}/>)}
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
