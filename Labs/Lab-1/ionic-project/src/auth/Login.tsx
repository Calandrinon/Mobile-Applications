import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import {
    IonButton, IonRow, IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonInput,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar, IonIcon
} from '@ionic/react';
import { AuthContext } from './AuthProvider';
import { getLogger } from '../core';
import { keyOutline } from 'ionicons/icons';

const log = getLogger('Login');

interface LoginState {
  username?: string;
  password?: string;
}

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const { isAuthenticated, isAuthenticating, login, authenticationError } = useContext(AuthContext);
  const [state, setState] = useState<LoginState>({});
  const { username, password } = state;
  const handleLogin = () => {
    log('handleLogin...');
    login?.(username, password);
  };
  log('render');
  if (isAuthenticated) {
    return <Redirect to={{ pathname: '/' }} />
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle>Authenticate</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
          <IonGrid>
              <IonRow>
                  <IonCol></IonCol>
                  <IonCol>
                      <IonInput
                          placeholder="Username"
                          value={username}
                          onIonChange={e => setState({
                              ...state,
                              username: e.detail.value || ''
                          })}/>
                      <IonInput
                          placeholder="Password"
                          value={password}
                          onIonChange={e => setState({
                              ...state,
                              password: e.detail.value || ''
                          })}/>
                      <IonLoading isOpen={isAuthenticating}/>
                      {authenticationError && (
                          <div>{authenticationError.message || 'Failed to authenticate'}</div>
                      )}
                  </IonCol>
                  <IonCol></IonCol>
              </IonRow>
              <IonRow class="ion-justify-content-center">
                  <IonButton onClick={handleLogin} fill="outline" color="dark"> <IonIcon slot="start" icon={keyOutline}></IonIcon> Login</IonButton>
              </IonRow>
          </IonGrid>
      </IonContent>
    </IonPage>
  );
};
