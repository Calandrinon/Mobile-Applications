import React, {useContext, useState} from 'react';
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
    IonToolbar, IonIcon, useIonViewWillEnter, IonCard, IonInfiniteScroll, IonInfiniteScrollContent
} from '@ionic/react';
import { getLogger } from '../core';

const log = getLogger('Login');

export const Quotes: React.FC<RouteComponentProps> = ({ history }) => {

    const [items, setItems] = useState<string[]>([]);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);

    async function fetchData() {
        const url: string = 'https://type.fit/api/quotes';
        const quotes: Response = await fetch(url);

        quotes
            .json()
            .then(async (response) => {
                console.log("QUOTES:");
                console.log(response);
                const shuffledQuotes = response.sort(() => 0.5 - Math.random());
                let randomQuotes = shuffledQuotes.slice(0, 15);
                setItems([...items, ...randomQuotes]);
            })
            .catch(err => console.error(err));
    }

    useIonViewWillEnter(async () => {
        await fetchData();
    });

    async function searchNext($event: CustomEvent<void>) {
        await fetchData();
        ($event.target as HTMLIonInfiniteScrollElement).complete();
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="success">
                    <IonTitle>Motivational quotes</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                {items.map((item: any, i: number) => {
                    console.log("Item from map:");
                    console.log(item);
                    const quoteDivStyle = {
                        fontSize: 'large'
                    };
                    return (
                        <IonCard key={`${i}`}>
                            <div style={quoteDivStyle}>"{item.text}"</div>
                            { item.author &&
                            <div style={quoteDivStyle}>       - {item.author}</div>
                            }
                        </IonCard>
                    )
                })}
                <IonInfiniteScroll threshold="100px" disabled={disableInfiniteScroll}
                                   onIonInfinite={(e: CustomEvent<void>) => {
                                       setTimeout(() => {}, 3000);
                                       searchNext(e)
                                   }}>
                    <IonInfiniteScrollContent
                        loadingText="Loading more quotes...">
                    </IonInfiniteScrollContent>
                </IonInfiniteScroll>
            </IonContent>
        </IonPage>
    );
};
