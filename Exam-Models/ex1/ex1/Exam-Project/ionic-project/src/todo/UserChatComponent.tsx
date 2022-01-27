import React, {useContext, useEffect, useState} from 'react';
import {RouteComponentProps, useParams} from 'react-router';
import {
    createAnimation,
    IonButton, IonButtons,
    IonCol,
    IonContent,
    IonFab,
    IonFabButton, IonGrid,
    IonHeader,
    IonIcon, IonInput, IonLabel,
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
import {ItemProps} from "./ItemProps";
import styled from 'styled-components';

const log = getLogger('ItemList');

const StyledInput = styled(IonInput)`
  border: 3px solid #55f061;
  border-radius: 10px;
`;

interface UserChatComponentProps extends RouteComponentProps {
    loggedUserId: string;
}

const UserChatComponent: React.FC<UserChatComponentProps> = ({ history , loggedUserId}) => {
    const { items, fetching, saving, savingError, saveItem, fetchingError } = useContext(ItemContext);
    const { appState } = useAppState();
    const {logout, token} = useContext(AuthContext);
    let networkStatus = useNetwork();
    const [text, setText] = useState('');
    const [read, setRead] = useState(false);
    const [sender, setSender] = useState('');
    const [created, setCreated] = useState(new Date());
    const [item, setItem] = useState<ItemProps>({userId: '', text: text, read: read, sender: sender, created: created});
    const { id } = useParams();

    useEffect(() => {
        (async () => {
            setSender((await Storage.get({key: "username"})).value);
            setText(item.text);
            setRead(read);
            setCreated(new Date());
        })();

        items?.sort((firstItem, secondItem) => {
            let firstDate = new Date(firstItem.created);
            let secondDate = new Date(secondItem.created);
            return +firstDate - +secondDate;
        });
        console.log("Sorted items:");
        console.log(items);
    }, []);

    const handleSave = async () => {
        const editedItem = { ...item, text, read, created, sender, userId: id};

        saveItem && saveItem(editedItem);//.then(() => history.goBack());
        items?.sort((firstItem, secondItem) => {
            let firstDate = new Date(firstItem.created);
            let secondDate = new Date(secondItem.created);
            return +firstDate - +secondDate;
        });
        console.log("Sorted items:");
        console.log(items);
    };

    log('render');

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="success">
                    <IonTitle>
                        Messages - {networkStatus.networkStatus.connected ? "Online" : "Offline"}
                    </IonTitle>
                    <IonButton slot="end" color="medium" onClick={handleSave}>
                        Save
                    </IonButton>

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
                {items && (
                    <IonList>
                        {items.filter(async (message) => {
                            let filterBooleanValue = Storage.get({key: "userId"}).then(userId => {
                                return message.userId === id || message.userId === String(userId.value);
                            });
                            return filterBooleanValue;
                        }).map(({ _id, text, read, sender, created}) =>
                            <Item key={_id} _id={_id} text={text} read={read} sender={sender} created={created} token={token}/>)}
                    </IonList>
                )}
                <IonLabel>Write a message:</IonLabel>
                <StyledInput value={text} onIonChange={e => setText(e.detail.value || '')} />

                <IonLoading isOpen={saving} />

                {savingError && (
                    <div>{savingError.message || 'Failed to save item'}</div>
                )}
                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch items'}</div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default UserChatComponent;
