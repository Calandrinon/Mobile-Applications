import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect } from 'react';
import { Plugins } from '@capacitor/core';

import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  useEffect(demoStorage, []);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer />
      </IonContent>
    </IonPage>
  );

  function demoStorage() {
    (async () => {
      const { Storage } = Plugins;

      // Saving ({ key: string, value: string }) => Promise<void>
      await Storage.set({
        key: 'user',
        value: JSON.stringify({
          username: 'a', password: 'a',
        })
      });

      // Loading value by key ({ key: string }) => Promise<{ value: string | null }>
      const res = await Storage.get({ key: 'user' });
      if (res.value) {
        console.log('User found', JSON.parse(res.value));
      } else {
        console.log('User not found');
      }

      // Loading keys () => Promise<{ keys: string[] }>
      const { keys } = await Storage.keys();
      console.log('Keys found', keys);

      // Removing value by key, ({ key: string }) => Promise<void>
      await Storage.remove({ key: 'user' });
      console.log('Keys found after remove', await Storage.keys());

      // Clear storage () => Promise<void>
      await Storage.clear();
    })();
  }
};

export default Home;
