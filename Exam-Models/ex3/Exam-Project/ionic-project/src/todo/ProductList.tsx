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

const ProductList: React.FC<RouteComponentProps> = ({ history }) => {
    const { items, fetching, fetchingError } = useContext(ItemContext);
    const { appState } = useAppState();
    const {logout, token} = useContext(AuthContext);
    let networkStatus = useNetwork();

    log('render');

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="success">
                    <IonTitle>
                        Products
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
                            {items && (
                                <IonList>
                                    {items.map(({ _id, name, productId, quantity, version}) =>
                                        <Item key={_id} _id={_id} name={name} productId={productId} quantity={quantity} version={version} onEdit={id => history.push(`/item/${id}`)} token={token}/>)}
                                </IonList>
                            )}
                        </IonCol>
                    </IonRow>
                </IonGrid>

                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch items'}</div>
                )}
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => history.push('/product')} color="dark" className="animatedButton">
                        <IonIcon icon={add}/>
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default ProductList;
