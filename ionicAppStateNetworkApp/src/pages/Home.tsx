import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import './Home.css';
import { useAppState } from './useAppState';
import { useNetwork } from './useNetwork';
import { useBackgroundTask } from './useBackgroundTask';

const Home: React.FC = () => {
  const { appState } = useAppState();
  const { networkStatus } = useNetwork();
  useBackgroundTask(() => new Promise(resolve => {
    console.log('My Background Task');
    resolve();
  }));
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div>App state is {JSON.stringify(appState)}</div>
        <div>Network status is {JSON.stringify(networkStatus)}</div>
      </IonContent>s
    </IonPage>
  );
};

export default Home;
