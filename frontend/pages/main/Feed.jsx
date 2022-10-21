import { Text, View, Image, FlatList, StyleSheet, Button } from "react-native";
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';

const Feed = ({ usersFollowingLoaded, feed, following, navigation }) => {
    const [ posts, setPosts ] = useState([]);

    useEffect(() => {
        if(usersFollowingLoaded != following.length || !following.length || !following.length) return;
        const posts = feed.map(post => post);
        posts.sort((x, y) => y.creation - x.creation);
        setPosts(posts);
    }, [ usersFollowingLoaded, feed ]);

    const navigateToComments = ({ id, user: { uid } }) => navigation.navigate('Comments', { postId: id, uid });

    const onLikeDislikePress = ({ currentUserLike, id: postId, user: { uid: userId } }) => {
        const likeDoc = firebase.firestore()
            .collection('posts')
            .doc(userId)
            .collection('userPosts')
            .doc(postId)
            .collection('likes')
            .doc(firebase.auth().currentUser.uid);

        if(currentUserLike) likeDoc.delete();
        else likeDoc.set({});
    };

    const renderItem = ({ item }) => (
        <View style={ styles.containerImage }>
            <Text style={ styles.container }>{ item.user.name }</Text>
            <Image
                style={ styles.image }
                source={{ uri: item.downloadURL }}
            />
            <Button
                title={ item.currentUserLike ? 'Dislike' : 'Like' }
                onPress={ () => onLikeDislikePress(item) }
            />
            <Text onPress={ () => navigateToComments(item) }>
                View Comments...
            </Text>
        </View>
    );

    return (
        <View style={ styles.container }>
            <View style={ styles.containerGallery }>
                <FlatList
                    numColumns={ 1 }
                    horizontal={ false }
                    data={ posts }
                    renderItem={ renderItem }
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, marginTop: 40 },
    containerGallery: { flex: 1 },
    containerImage: { flex: 1 / 3 },
    image: { flex: 1, aspectRatio: 1 / 1 },
});

const mapStateToProps = ({ usersState: { usersFollowingLoaded, feed }, userState: { following } }) => ({
    usersFollowingLoaded,
    feed,
    following,
});

export default connect(mapStateToProps, null)(Feed);
