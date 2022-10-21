import { Camera, CameraType } from 'expo-camera';
import { Button, View, StyleSheet, Image } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1,
    },
});

const Add = ({ navigation }) => {

    const goBackToFeed = () => navigation.navigate('Feed');

    const [ type, setType ] = useState(CameraType.back);
    const [ cameraPermission, requestCameraPermission ] = Camera.useCameraPermissions();
    const [ galleryPermission, requestGalleryPermission ] = ImagePicker.useMediaLibraryPermissions();
    const [ image, setImage ] = useState(null);

    const isCameraPermissionNotGranted = !cameraPermission || !cameraPermission.granted;
    const isGalleryPermissionNotGranted = !galleryPermission || !galleryPermission.granted;
    const arePermissionsNotGranted = isCameraPermissionNotGranted || isGalleryPermissionNotGranted;

    const cameraRef = useRef(null);

    const requestPermissionIfNotGranted = () => {
        [
            [ isCameraPermissionNotGranted, requestCameraPermission ],
            [ isGalleryPermissionNotGranted, requestGalleryPermission ],
        ].forEach(async ([ permission, func ]) => {
            if (permission) await func()
                .then(({ granted }) => {
                    if(!granted) goBackToFeed();
                })
                .catch(() => goBackToFeed());
            });
    };

    useEffect(() => {
        requestPermissionIfNotGranted();
    }, []);

    if(arePermissionsNotGranted) return <View/>;


    const toggleCameraType = () => {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    };

    const takePicture = async () => {
        if(!cameraRef.current) return;
        const { uri } = await cameraRef.current.takePictureAsync(null);
        setImage(uri);
    };

    const pickImage = async () => {
        const { uri, cancelled } = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!cancelled) setImage(uri);
    };

    const goToSave = () => navigation.navigate('Save', { image });

    const buttons = [
        [ 'Flip Image', toggleCameraType ],
        [ 'Take Picture', takePicture ],
        [ 'Pick Image From Gallery', pickImage ],
        [ 'Save', goToSave ],
    ];

    return (
        <View style={{ flex: 1 }}>
            <View style={ styles.cameraContainer }>
                <Camera
                    ref={ cameraRef }
                    style={ styles.fixedRatio }
                    type={ type }
                    ratio={ '1:1' }
                />
            </View>
            {buttons.map(([ title, onPress ]) => (
                <Button
                    key={ title }
                    title={ title }
                    onPress={ onPress }
                />
            ))}
            {image && <Image source={{ uri: image }} style={{ flex: 1 }}/>}
        </View>
    );
}

export default Add;
