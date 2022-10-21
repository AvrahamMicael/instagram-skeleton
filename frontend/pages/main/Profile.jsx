import { Text, View, Image, FlatList, StyleSheet, Button } from "react-native";
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { clearData } from './../../redux/actions/index';
import { bindActionCreators } from "redux";

const Profile = ({ currentUser, posts, following, clearData, route: { params: { uid } } }) => {
    const [ userPosts, setUserPosts ] = useState([]);
    const [ user, setUser ] = useState(null);
    const [ isFollowing, setIsFollowing ] = useState(false);

    useEffect(() => {
        if(following.indexOf(uid) != -1) setIsFollowing(true);
        if(uid != firebase.auth().currentUser.uid)
        {
            firebase.firestore()
                .collection('users')
                .doc(uid)
                .get()
                .then(snapshot => {
                    if(!snapshot.exists) return;
                    setUser(snapshot.data());
                });
            firebase.firestore()
                .collection('posts')
                .doc(uid)
                .collection('userPosts')
                .orderBy('creation', 'desc')
                .get()
                .then(({ docs }) => {
                    setUserPosts(docs.map(doc => {
                        const data = doc.data();
                        data.creation = data.creation.seconds;
                        return { ...data, id: doc.id };
                    }));
                });
            return;
        }
        setUser(currentUser);
        setUserPosts(posts);
    }, [ uid, following ]);

    if(user === null) return <View/>;

    const toggleFollow = () => {
        const doc = firebase.firestore()
            .collection('following')
            .doc(firebase.auth().currentUser.uid)
            .collection('userFollowing')
            .doc(uid)

        if(isFollowing)
        {
            doc.delete();
            setIsFollowing(false);
            return;
        }
        doc.set({});
        setIsFollowing(true);
    };

    const onLogout = () => {
        firebase.auth().signOut();
        clearData();
    };

    return (
        <View style={ styles.container }>
            <View style={ styles.containerInfo }>
                <Text>Profile - { user.name }</Text>
                <Text>Email - { user.email }</Text>
                <View>
                    {uid == firebase.auth().currentUser.uid ? (
                        <Button
                            title="Logout"
                            onPress={ onLogout }
                        />                    
                    )
                    : (
                        <Button
                            title={ isFollowing ? 'Following' : 'Follow' }
                            onPress={ toggleFollow }
                        />
                    )}
                </View>
            </View>
            <View style={ styles.containerGallery }>
                <FlatList
                    numColumns={ 3 }
                    horizontal={ false }
                    data={ userPosts }
                    renderItem={ renderItem }
                />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: { flex: 1, marginTop: 40 },
    containerInfo: { margin: 10 },
    containerGallery: { flex: 1 },
    containerImage: { flex: 1 / 3 },
    image: { flex: 1, aspectRatio: 1 / 1 },
});

const renderItem = ({ item }) => (
    <View style={ styles.containerImage }>
        <Image
            style={ styles.image }
            source={{ uri: item.downloadURL }}
        />
    </View>
);

const mapStateToProps = ({ userState }) => userState;
const mapDispatchProps = dispatch => bindActionCreators({ clearData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Profile);
