import React, {useContext, useEffect} from 'react';
import { RouteComponentProps } from 'react-router';
import {
  createAnimation,
  IonButton, IonButtons,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton, IonGrid,
  IonHeader,
  IonIcon,
  IonList, IonLoading, IonMenuButton,
  IonPage, IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { add } from 'ionicons/icons';
import Item from './Item';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import {useAppState} from "../statusHooks/useAppState";
import {AuthContext} from "../auth";
import {Storage} from "@capacitor/core";
import {updateUserStatus} from "./userApi";
import {useNetwork} from "../statusHooks/useNetwork";
import {deleteItem} from "./itemApi";
import AnimationDemo from "../animations/AnimationDemo";

const log = getLogger('ItemList');

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError } = useContext(ItemContext);
  const { appState } = useAppState();
  const {logout, token} = useContext(AuthContext);
  let networkStatus = useNetwork();

  useEffect(simpleAnimation, []);

  function simpleAnimation() {
    const el = document.querySelector('.animatedButton');
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

  console.log("Current app state:");
  console.log(appState);
  log('render');
  return (
      <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle>
            Tasks - {networkStatus.networkStatus.connected ? "Online" : "Offline"}
          </IonTitle>
          <IonButton slot="end" color="medium" onClick={async () => {
            let userId = await Storage.get({key: "userId"});
            let token = await Storage.get({key: "token"});
            await updateUserStatus(userId.value, token.value, false);
            logout?.();
          }}>Log off</IonButton>
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
                          <Item key={_id} _id={_id} text={text} category={category} onEdit={id => history.push(`/item/${id}`)} token={token}/>)}
                    </IonList>
                )}
            </IonCol>
            <IonCol>
              <h1>Decide</h1>
              {items && (
                  <IonList>
                    {items.filter((item => item.category === "Decide")).map(({ _id, text, category}) =>
                        <Item key={_id} _id={_id} text={text} category={category} onEdit={id => history.push(`/item/${id}`)} token={token}/>)}
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
                        <Item key={_id} _id={_id} text={text} category={category} onEdit={id => history.push(`/item/${id}`)} token={token}/>)}
                  </IonList>
              )}
            </IonCol>
            <IonCol>
              <h1>Delete</h1>
              {items && (
                  <IonList>
                    {items.filter((item => item.category === "Delete")).map(({ _id, text, category}) =>
                        <Item key={_id} _id={_id} text={text} category={category} onEdit={id => history.push(`/item/${id}`)} token={token}/>)}
                  </IonList>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>

        {fetchingError && (
          <div>{fetchingError.message || 'Failed to fetch items'}</div>
        )}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/item')} color="dark" className="animatedButton">
            <IonIcon icon={add}/>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ItemList;
