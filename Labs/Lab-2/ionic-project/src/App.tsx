import React, {useContext, useEffect} from 'react';
import { Redirect, Route } from 'react-router-dom';
import {IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ItemEdit, ItemList, UsersList } from './todo';

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
import {Quotes} from "./quotes/Quotes";
import {QuotesFilter} from "./quotes/QuotesFilter";
import {QuotesSearch} from "./quotes/QuotesSearch";

const App: React.FC = () => {
    return (
        <IonApp>
            <IonReactRouter>
                <AuthProvider>
                    <IonTabs>
                        <IonRouterOutlet>
                            <Route path="/login" component={Login} exact={true}/>
                            <ItemProvider>
                                <PrivateRoute path="/items" component={ItemList} exact={true}/>
                                <PrivateRoute path="/item" component={ItemEdit} exact={true}/>
                                <PrivateRoute path="/item/:id" component={ItemEdit} exact={true}/>
                                <PrivateRoute path="/users" component={UsersList} exact={true}/>
                                <PrivateRoute path="/quotes" component={Quotes} exact={true}/>
                                <PrivateRoute path="/filterQuotesByAuthor" component={QuotesFilter} exact={true}/>
                                <PrivateRoute path="/searchQuotesByAuthor" component={QuotesSearch} exact={true}/>
                            </ItemProvider>
                            <Route exact path="/" render={() => <Redirect to="/items"/>}/>
                        </IonRouterOutlet>
                        <IonTabBar slot="bottom" color="success">
                            <IonTabButton tab="itemsTab" href="/items">
                                <IonIcon icon={pricetagsOutline} /> Tasks
                            </IonTabButton>
                            <IonTabButton tab="usersTab" href="/users">
                                <IonIcon icon={person} /> Users
                            </IonTabButton>
                            <IonTabButton tab="quotesTab" href="/quotes">
                                <IonIcon icon={libraryOutline} /> Quotes
                            </IonTabButton>
                            <IonTabButton tab="quotesFilteringTab" href="/filterQuotesByAuthor">
                                <IonIcon icon={beakerOutline} /> Filter quotes by author
                            </IonTabButton>
                            <IonTabButton tab="quotesSearchingTab" href="/searchQuotesByAuthor">
                                <IonIcon icon={searchOutline}/> Search quotes by author
                            </IonTabButton>
                        </IonTabBar>
                    </IonTabs>
                </AuthProvider>
            </IonReactRouter>
        </IonApp>
    );
}

export default App;
