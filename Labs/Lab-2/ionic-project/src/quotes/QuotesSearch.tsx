import React, {useContext, useEffect, useState} from 'react';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import {
    IonButton,
    IonRow,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonInput,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar,
    IonIcon,
    useIonViewWillEnter,
    IonCard,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSelect,
    IonSelectOption, IonSearchbar, IonList, IonItem
} from '@ionic/react';
import { getLogger } from '../core';
import {useNetwork} from "../statusHooks/useNetwork";

const log = getLogger('Login');

export const QuotesSearch: React.FC<RouteComponentProps> = ({ history }) => {
    const [authors, setAuthors] = useState<string[]>([]);
    const [searchAuthor, setSearchAuthor] = useState<string>('');
    const networkStatus = useNetwork();

    async function fetchAuthors() {
        const url: string = 'https://type.fit/api/quotes';
        const quotes: Response = await fetch(url);

        quotes
            .json()
            .then(async (response) => {
                setAuthors(response.map((quote: any) => quote.author).sort()
                    .filter((v: any, i: any, a: any) => a.indexOf(v) === i));
                console.log("Authors:");
                console.log(authors);
            })
            .catch(err => console.error(err));
    }

    useIonViewWillEnter(async () => {
        await fetchAuthors();
    });

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="success">
                    <IonTitle>Search authors</IonTitle>
                    <h3 slot="end">{networkStatus.networkStatus.connected ? "Online" : "Offline"}</h3>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonSearchbar
                    value={searchAuthor}
                    debounce={1000}
                    onIonChange={e => setSearchAuthor(e.detail.value!)}>
                </IonSearchbar>
                {!networkStatus.networkStatus.connected &&
                <h3>Your connection is down. The quotes cannot be displayed.</h3>
                }
                <IonList>
                    {authors
                        .filter((author: string) => !!author && author.indexOf(searchAuthor) >= 0)
                        .map((author: string) => <IonItem key={author}>{author}</IonItem>)}
                </IonList>
            </IonContent>
        </IonPage>
    );
};
