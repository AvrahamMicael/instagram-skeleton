import { Button, FlatList, Text, TextInput, View } from "react-native";
import { useState } from 'react';
import { useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUsersData } from './../../redux/actions/index';

const Comment = ({ users, fetchUsersData, route: { params } }) => {
    const [ comments, setComments ] = useState([]);
    const [ postId, setPostId ] = useState('');
    const [ text, setText ] = useState('');
    const [ refresh, setRefresh ] = useState(false);

    const toggleRefresh = () => setRefresh(!refresh);

    const commentsCollection = firebase.firestore()
        .collection('posts')
        .doc(params.uid)
        .collection('userPosts')
        .doc(params.postId)
        .collection('comments');

    const matchUserToComment = comments => {
        comments.forEach(({ creator, user }, index, comments) => {
            if(user !== undefined) return;
            const commentCreator = users.find(user => user.uid == creator);
            if(commentCreator === undefined)
            {
                fetchUsersData(creator, false)
                return;
            }
            comments[index].user = commentCreator;
        });
        setComments(comments);
    };

    useEffect(() => {
        if(postId == params.postId)
        {
            matchUserToComment(comments);
            toggleRefresh();
            return;
        }
        commentsCollection
            .get()
            .then(({ docs }) => {
                const comments = docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                matchUserToComment(comments);
            });
        setPostId(params.postId)
    }, [ params.postId, users ]);

    const renderItem = ({ item: { text, user } }) => (
        <View>
            {user !== undefined && (
                <Text>{ user.name }</Text>
            )}
            <Text>{ text }</Text>
        </View>
    );

    const onCommentSend = () => {
        const comment = {
            creator: firebase.auth().currentUser.uid,
            text,
        };
        commentsCollection
            .add(comment)
            .then(() => {
                matchUserToComment([ comment, ...comments ]);
                toggleRefresh();
            });
        setText('');
    };

    return (
        <View>
            <FlatList
                numColumns={ 1 }
                horizontal={ false }
                data={ comments }
                renderItem={ renderItem }
                extraData={ refresh }
            />
            <View>
                <TextInput
                    placeholder="Comment..."
                    onChangeText={ text => setText(text) }
                    value={ text }
                />
                <Button
                    title="Send"
                    onPress={ onCommentSend }
                />
            </View>
        </View>
    );
};

const mapStateToProps = ({ usersState: { users } }) => ({ users });
const mapDispatchProps = dispatch => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comment);
