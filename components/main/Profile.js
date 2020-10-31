import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native'

import firebase from 'firebase'
require('firebase/firestore')

// redux 로 부터 데이터 가져오기.
import { connect } from 'react-redux'

function Profile(props) {
    const [userPosts, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [following, setFollowing] = useState(false)

    useEffect(() => {
        // currentUser, posts 는 redux-reducer 로 부터 가져오는 데이터이다.
        const { currentUser, posts } = props;

        // [예외처리]
        // 이전 컴포넌트로 부터 받은 uid 와 현재 로그인 되어 있는 uid 와 비교 후 
        // => navigation.navigate("Profile", { uid: firebase.auth().currentUser.uid })
        // reducer 로 부터 가져온 데이터를 setXxx 바인딩 해준다.
        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser)
            setUserPosts(posts)
        }
        // 정보가 일치하지 않음 == 검색 페이지로부터 넘어올때 => nativation로 부터 데이터를 넘겨 받았기 때문에
        // props.route.params 안에있는 uid 를 가져 온 후 데이터 바인딩.
        else {
            firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        setUser(snapshot.data());
                    }
                    else {
                        console.log('does not exist')
                    }
                })
            firebase.firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection("userPosts")
                .orderBy("creation", "asc")
                .get()
                .then((snapshot) => {
                    let posts = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    setUserPosts(posts)
                })
        }

        // indexOf 를 사용하여 팔로워 Index 목록에 포함되어있는지 확인.
        // if (props.following.indexOf(props.route.params.uid) > -1) {
        //     setFollowing(true);
        // } else {
        //     setFollowing(false);
        // }
        (props.following.indexOf(props.route.params.uid) > -1) ?
            setFollowing(true) :
            setFollowing(false);

    }, [props.route.params.uid, props.following])

    const onFollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .set({})
    }
    const onUnfollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .delete()
    }

    // 렌더링 대기 상황 중 user 정보가 없을 경우 페이지가 뻗는걸 대비해서 예외처리 작업을 해주자. 
    if (user === null) {
        return <View />
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>

                {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                    <View>
                        {following ?
                            (
                                <Button
                                    title="Following"
                                    onPress={() => onUnfollow()}
                                />
                            ) :
                            (
                                <Button
                                    title="Follow"
                                    onPress={() => onFollow()}
                                />
                            )}
                    </View>
                ) : null}
            </View>

            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={4}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({ item }) => (
                        <View
                            style={styles.containerImage}>

                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />
                        </View>
                    )}
                />
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1 / 4
    },
    image: {
        flex: 1,
        // 이미지 비율
        aspectRatio: 1 / 1
    }
})

// redux-store 로 부터 데이터 로딩.
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
})

// 위에서 정의한 props를 H.O.C 방식으로 Profile 컴포넌트에 넘겨준다..
export default connect(mapStateToProps, null)(Profile);
