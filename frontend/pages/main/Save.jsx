import { useState } from "react";
import { Button, Image, TextInput, View } from "react-native";
import firebase from 'firebase/compat/app'
import 'firebase/firebase-storage-compat';

const Component = ({ route: { params: { image } }, navigation }) => {
    const [ caption, setCaption ] = useState('');

    const updateCaption = caption => setCaption(caption);

    const savePostData = downloadURL => {
        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection('userPosts')
            .add({
                downloadURL,
                caption,
                creation: firebase.firestore.FieldValue.serverTimestamp(),
            }).then(() => {
                navigation.popToTop()
            });
    };

    const uploadImage = async () => {
        const childPath = `posts/${ firebase.auth().currentUser.uid }/${ Math.random().toString(36) }`

        const res = await fetch(image);
        const blob = await res.blob();
        const task = firebase.storage()
            .ref()
            .child(childPath)
            .put(blob);
        const taskProgress = snapshot => {
            // console.log(`transferred: ${snapshot.bytesTransferred}`)
        };
        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL()
                .then(savePostData);
        };

        const taskError = snapshot => {
            console.log('error', snapshot)
        };

        task.on('state_change', taskProgress, taskError, taskCompleted);
    };
    return (
        <View style={{ flex: 1 }}>
            <Image source={ image }/>
            <TextInput
                placeholder="Write a Caption..."
                onChangeText={ updateCaption }
            />
            <Button
                title="Save"
                onPress={ uploadImage }
            />
        </View>
    );
};

export default Component;
