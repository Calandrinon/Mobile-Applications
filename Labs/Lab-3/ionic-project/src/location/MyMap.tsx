import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { compose, withProps } from 'recompose';
import { mapsApiKey } from './mapsApiKey';

interface MyMapProps {
    lat?: number | undefined;
    lng?: number | undefined;
    targetLat?: number | undefined;
    targetLng?: number | undefined;
    onMapClick: (e: any) => void,
    onMarkerClick: (e: any) => void,
}

// @ts-ignore
// @ts-ignore
export const MyMap =
    compose<MyMapProps, any>(
        withProps({
            googleMapURL:
                `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&v=3.exp&libraries=geometry,drawing,places`,
            loadingElement: <div style={{ height: `100%` }} />,
            containerElement: <div style={{ height: `80%` }} />,
            mapElement: <div style={{ height: `100%` }} />
        }),
        withScriptjs,
        withGoogleMap
    )(props => {
        console.log(`targetLat: ${props.targetLat}; targetLng: ${props.targetLng}`);
        return (
            //@ts-ignore
            <GoogleMap defaultZoom={8} defaultCenter={{ lat: props.lat, lng: props.lng }} onClick={props.onMapClick}>
                {
                    //@ts-ignore
                    <Marker position={{ lat: props.lat, lng: props.lng }} onClick={props.onMarkerClick}/>
                }
                { props.targetLng !== undefined && !props.targetLat !== undefined &&
                    //@ts-ignore
                    <Marker position={{ lat: props.targetLat, lng: props.targetLng}} onClick={props.onMarkerClick}/>
                }
            </GoogleMap>
        )
    })