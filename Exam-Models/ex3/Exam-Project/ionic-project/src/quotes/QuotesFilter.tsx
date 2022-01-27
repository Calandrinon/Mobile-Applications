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
    IonSelectOption
} from '@ionic/react';
import { getLogger } from '../core';
import {useNetwork} from "../statusHooks/useNetwork";

const log = getLogger('Login');

export const QuotesFilter: React.FC<RouteComponentProps> = ({ history }) => {
    const [authors, setAuthors] = useState<string[]>([]);
    const [items, setItems] = useState<string[]>([]);
    const [filter, setFilter] = useState<string | undefined>(undefined);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
    const networkStatus = useNetwork();

    async function fetchAuthors() {
        const url: string = 'https://type.fit/api/quotes';
        const quotes: Response = await fetch(url);

        quotes
            .json()
            .then(async (response) => {
                setAuthors(response.map((quote: any) => quote.author).sort().filter((v: any, i: any, a: any) => a.indexOf(v) === i));
            })
            .catch(err => console.error(err));
    }

    async function fetchData() {
        const quotes: string[] = [];
        const url: string = 'https://type.fit/api/quotes';
        const res: Response = await fetch(url);

        res
            .json()
            .then(async (response) => {
                let filteredQuotes = response.filter((quote: any) => quote.author == filter && !!quote.author)
                    .sort(() => 0.5 - Math.random());
                setItems([...quotes, ...filteredQuotes]);
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        fetchData();
    }, [filter]);

    async function searchNext($event: CustomEvent<void>) {
        await fetchData();
        ($event.target as HTMLIonInfiniteScrollElement).complete();
    }

    useIonViewWillEnter(async () => {
        await fetchAuthors();
    });

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="success">
                    <IonTitle>Filter quotes</IonTitle>
                    <h3 slot="end">{networkStatus.networkStatus.connected ? "Online" : "Offline"}</h3>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonSelect value={filter} placeholder="Select author" onIonChange={e => {
                    setItems([]);
                    setFilter(e.detail.value);
                }}>
                    {authors.map(author => <IonSelectOption key={author} value={author}>{author}</IonSelectOption>)}
                </IonSelect>
                {!networkStatus.networkStatus.connected &&
                <h3>Your connection is down. The quotes cannot be displayed.</h3>
                }
                {items.map((item: any, i: number) => {
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
                                   onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
                    <IonInfiniteScrollContent
                        loadingText="Loading more quotes...">
                    </IonInfiniteScrollContent>
                </IonInfiniteScroll>
            </IonContent>
        </IonPage>
    );
};
