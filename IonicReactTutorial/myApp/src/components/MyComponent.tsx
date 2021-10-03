import {add} from "ionicons/icons";
import {
    IonBadge,
    IonCheckbox,
    IonContent, IonFab, IonFabButton,
    IonHeader, IonIcon,
    IonItem,
    IonLabel,
    IonList, IonNote,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './MyComponent.css';
import {RouteComponentProps} from "react-router";

const MyComponent: React.FC<RouteComponentProps> = (props) => {
    return (
        <IonPage>
            <IonContent>
                <IonList>
                    <IonItem>
                        <IonCheckbox slot="start" />
            <IonLabel>
                <h1>Create Idea</h1>
    <IonNote>Run Idea by Brandy</IonNote>
    </IonLabel>
    <IonBadge color="success" slot="end">
        5 Days
    </IonBadge>
    </IonItem>
    </IonList>

    <IonFab vertical="bottom" horizontal="end" slot="fixed">
    <IonFabButton onClick={() => props.history.push('/new')}>
    <IonIcon icon={add} />
    </IonFabButton>
    </IonFab>

    </IonContent>
    <ExploreContainer />
    </IonPage>
);
};

export default MyComponent;
