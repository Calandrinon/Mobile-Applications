import React, {useContext, useEffect} from 'react';
import { Redirect, Route } from 'react-router-dom';
import {IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { UsersList } from './todo';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { ItemProvider } from './todo/ItemProvider';
import {AuthContext, AuthProvider, Login, PrivateRoute} from './auth';
import {
    beakerOutline,
    call,
    ellipse,
    libraryOutline,
    person,
    pricetagsOutline, searchOutline,
    settings,
    triangle
} from "ionicons/icons";
import UserChatComponent from "./todo/UserChatComponent";

const App: React.FC = () => {
    return (
        <IonApp>
            <IonReactRouter>
                <AuthProvider>
                    <IonTabs>
                        <IonRouterOutlet>
                            <Route path="/login" component={Login} exact={true}/>
                            <ItemProvider>
                                <PrivateRoute path="/users" component={UsersList} exact={true}/>
                                <PrivateRoute path="/userChat/:id/:username" component={UserChatComponent} exact={true}/>
                            </ItemProvider>
                            <Route exact path="/" render={() => <Redirect to="/users"/>}/>
                        </IonRouterOutlet>
                        <IonTabBar slot="bottom" color="success">
                            <IonTabButton tab="usersTab" href="/users">
                                <IonIcon icon={person} /> Users
                            </IonTabButton>
                        </IonTabBar>
                    </IonTabs>
                </AuthProvider>
            </IonReactRouter>
        </IonApp>
    );
}

export default App;
