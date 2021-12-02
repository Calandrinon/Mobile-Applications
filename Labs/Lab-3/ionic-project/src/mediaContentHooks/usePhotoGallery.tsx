import {useCamera} from '@ionic/react-hooks/camera';
import {
    CameraPhoto,
    CameraResultType,
    CameraSource,
    FileReadResult,
    FilesystemDirectory,
    Plugins
} from '@capacitor/core';
import {useEffect, useState} from 'react';
import {base64FromPath, useFilesystem} from '@ionic/react-hooks/filesystem';
import {useStorage} from '@ionic/react-hooks/storage';
import {Storage} from "@capacitor/core";

export interface Photo {
    userId: string;
    itemId: string | undefined;
    filepath: string;
    webviewPath?: string;
}

const PHOTO_STORAGE = 'photos';

export function usePhotoGallery() {
    const { getPhoto } = useCamera();
    const [photos, setPhotos] = useState<Photo[]>([]);

    const takePhoto = async (itemId: string | undefined) => {
        const cameraPhoto = await getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100
        });
        const fileName = new Date().getTime() + '.jpeg';
        const savedFileImage = await savePicture(cameraPhoto, fileName, itemId);
        const newPhotos = [savedFileImage, ...photos];
        setPhotos(newPhotos);
        await set(PHOTO_STORAGE, JSON.stringify(newPhotos));
    };

    const { deleteFile, readFile, writeFile } = useFilesystem();
    const savePicture = async (photo: CameraPhoto, fileName: string, itemId: string | undefined): Promise<Photo> => {
        const base64Data = await base64FromPath(photo.webPath!);
        await writeFile({
            path: fileName,
            data: base64Data,
            directory: FilesystemDirectory.Data
        });

        let userId = await Storage.get({key: "userId"});

        return {
            userId: userId.value,
            itemId: itemId,
            filepath: fileName,
            webviewPath: photo.webPath
        };
    };

    const getSavedPhoto = async (filename: string): Promise<(FileReadResult | null)> => {
        const photosString = await get(PHOTO_STORAGE);
        const photos = (photosString ? JSON.parse(photosString) : []) as Photo[];
        let resultToReturn: FileReadResult;

        for (let photo of photos) {
            if (photo.filepath === filename) {
                //photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
                readFile({
                    path: photo.filepath,
                    directory: FilesystemDirectory.Data
                }).then((result) => {
                    resultToReturn = result;
                })
                break;
            }
        }

        // @ts-ignore
        if (resultToReturn === undefined)
            return null;
        return resultToReturn;
    };

    const { get, set } = useStorage();
    useEffect(() => {
        const loadSaved = async () => {
            const photosString = await get(PHOTO_STORAGE);
            const photos = (photosString ? JSON.parse(photosString) : []) as Photo[];
            for (let photo of photos) {
                const file = await readFile({
                    path: photo.filepath,
                    directory: FilesystemDirectory.Data
                });
                photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
            }
            setPhotos(photos);
        };
        loadSaved();
    }, [get, readFile]);

    const deletePhoto = async (photo: Photo) => {
        const newPhotos = photos.filter(p => p.filepath !== photo.filepath);
        set(PHOTO_STORAGE, JSON.stringify(newPhotos));
        const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
        await deleteFile({
            path: filename,
            directory: FilesystemDirectory.Data
        });
        setPhotos(newPhotos);
    };

    return {
        photos,
        takePhoto,
        deletePhoto,
        getSavedPhoto
    };
}