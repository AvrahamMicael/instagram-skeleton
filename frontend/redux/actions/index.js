import { CLEAR_DATA, USERS_DATA_STATE_CHANGE, USERS_LIKES_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_STATE_CHANGE } from '../constants';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

export const clearData = () => dispatch => {
    dispatch({ type: CLEAR_DATA });
};

export const fetchUser = () => dispatch => {
    firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then(snapshot => {
            if(!snapshot.exists) return;
            dispatch({
                type: USER_STATE_CHANGE,
                currentUser: snapshot.data(),
            });
        });
};

export const fetchUserPosts = () => dispatch => {
    firebase.firestore()
        .collection('posts')
        .doc(firebase.auth().currentUser.uid)
        .collection('userPosts')
        .orderBy('creation', 'desc')
        .get()
        .then(({ docs }) => {
            const posts = docs.map(doc => {
                const data = doc.data();
                data.creation = data.creation.seconds;
                return { ...data, id: doc.id };
            });
            dispatch({
                type: USER_POSTS_STATE_CHANGE,
                posts,
            });
        });
};

export const fetchUserFollowing = () => dispatch => {
    firebase.firestore()
        .collection('following')
        .doc(firebase.auth().currentUser.uid)
        .collection('userFollowing')
        .onSnapshot(({ docs }) => {
            const following = docs.map(({ id }) => id);
            dispatch({
                type: USER_FOLLOWING_STATE_CHANGE,
                following,
            });
            following.forEach(followingId => {
                dispatch(fetchUsersData(followingId));
            });
        });
};

export const fetchUsersData = (uid, getPosts = true) => (dispatch, getState) => {
    const found = getState().usersState
        .users
        .some(user => user.uid == uid);

    if(found) return;
    firebase.firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then(snapshot => {
            if(!snapshot.exists) return;
            const user = snapshot.data();
            user.uid = snapshot.id;
            dispatch({
                type: USERS_DATA_STATE_CHANGE,
                user,
            });
            if(getPosts) dispatch(fetchUserFollowingPosts(user.uid));
        });
};

export const fetchUserFollowingPosts = uid => (dispatch, getState) => {
    firebase.firestore()
        .collection('posts')
        .doc(uid)
        .collection('userPosts')
        .orderBy('creation', 'desc')
        .get()
        .then(({ docs }) => {
            const user = getState().usersState.users.find(user => user.uid == uid);
            const posts = docs.map(doc => {
                const data = doc.data();
                data.creation = data.creation.seconds;
                return { ...data, id: doc.id, user };
            });
            posts.forEach(({ id }) => {
                dispatch(fetchUserFollowingLikes(uid, id));
            });
            dispatch({
                type: USERS_POSTS_STATE_CHANGE,
                posts,
            });
        });
};

export const fetchUserFollowingLikes = (uid, postId) => dispatch => {
    firebase.firestore()
        .collection('posts')
        .doc(uid)
        .collection('userPosts')
        .doc(postId)
        .collection('likes')
        .doc(firebase.auth().currentUser.uid)
        .onSnapshot(({ exists }) => {
            dispatch({
                type: USERS_LIKES_STATE_CHANGE,
                currentUserLike: exists,
                postId,
            });
        });
};
