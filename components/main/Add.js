import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function Add() {
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');

            const galleryStatus = await ImagePicker.requestCameraRollPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (camera) {
            const { uri } = await camera.takePictureAsync(null);
            setImage(uri);
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };


    // 권한 요청 로딩 전 View 화면
    if (hasCameraPermission === null || hasGalleryPermission === false) {
        return <View />;
    }
    // 유저로 부터 권한을 얻지 못했을 경우
    if (hasCameraPermission === false || hasGalleryPermission === false) {
        return <Text>No access to camera</Text>;
    }
    // 권한 받은 후 카메라 모듈 관련 출력
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.cameraContainer}>0
                {/* ratio 를 수정하여 유저 카메라 모듈의 비율을 맞춰준다. */}
                <Camera
                    ref={ref => setCamera(ref)}
                    style={styles.fixedRatio}
                    type={type}
                    ratio={'1:1'} />
            </View>

            {/* Camera.Constants ? front : back 을 통해 전,후방 카메라 로딩 */}
            <Button
                title="Flip Image"
                onPress={() => {
                    setType(
                        type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                    );
                }}>
            </Button>
            <Button title="Take Picture" onPress={() => takePicture()} />
            <Button title="Pick Image From Gallery" onPress={() => pickImage()} />
            {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
        </View>
    );
}

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1
    }
})