import React, {useContext, useEffect} from 'react';
import {RouteComponentProps} from 'react-router';
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
import {add} from 'ionicons/icons';
import Product from './Product';
import {getLogger} from '../core';
import {ProductContext} from './ProductProvider';
import {useAppState} from "../statusHooks/useAppState";
import {AuthContext} from "../auth";
import {Storage} from "@capacitor/core";
import {updateUserStatus} from "./userApi";
import {useNetwork} from "../statusHooks/useNetwork";
import {deleteProduct} from "./ProductApi";
import AnimationDemo from "../animations/AnimationDemo";

const log = getLogger('ProductList');

const ProductList: React.FC<RouteComponentProps> = ({history}) => {
    const {products, fetching, fetchingError} = useContext(ProductContext);
    const {appState} = useAppState();
    const {logout, token} = useContext(AuthContext);
    let networkStatus = useNetwork();

    useEffect(simpleAnimation, []);

    function simpleAnimation() {
        const el = document.querySelector('.animatedButton');
        if (el) {
            const animation = createAnimation()
                .addElement(el)
                .duration(1000)
                .direction('alternate')
                .iterations(Infinity)
                .keyframes([
                    {offset: 0, transform: 'scale(1.25)', opacity: '1'},
                    {
                        offset: 1, transform: 'scale(1)', opacity: '0.5'
                    }
                ]);
            animation.play();
        }
    }

    console.log("Current app state:");
    console.log(appState);
    log('render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="success">
                    <IonTitle>
                        Exam - {networkStatus.networkStatus.connected ? "Online" : "Offline"}
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
                <IonLoading isOpen={fetching} message="Fetching products"/>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <h1>Exam products</h1>
                            {products && (
                                <IonList>
                                    {products.map(({_id, text, category}) =>
                                        <Product key={_id} _id={_id} text={text} category={category}
                                                 onEdit={id => history.push(`/product/${id}`)} token={token}/>)}
                                </IonList>
                            )}
                        </IonCol>
                    </IonRow>
                </IonGrid>

                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch products'}</div>
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
