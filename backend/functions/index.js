const functions = require("firebase-functions");

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

const changePostLikesCount = incrementQty => (_,{ params: { creatorId, postId } }) =>
    db.collection('posts')
        .doc(creatorId)
        .collection('userPosts')
        .doc(postId)
        .update({
            likesCount: admin.firestore.FieldValue.increment(incrementQty)
        });

exports.addLike = functions.firestore.document('/posts/{creatorId}/userPosts/{postId}/likes/{userId}')
    .onCreate(changePostLikesCount(1));

exports.removeLike = functions.firestore.document('/posts/{creatorId}/userPosts/{postId}/likes/{userId}')
    .onDelete(changePostLikesCount(-1));
