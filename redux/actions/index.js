import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE } from '../constants/index'
import firebase from 'firebase'
import { SnapshotViewIOSComponent } from 'react-native'
require('firebase/firestore')

export function fetchUser() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() })
                }
                else {
                    console.log('does not exist')
                }
            })
    })
}

export function fetchUserPosts() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                // console.log(snapshot.docs)
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                // console.log(posts)
                dispatch({ type: USER_POSTS_STATE_CHANGE, posts })
            })
    })
}

export function fetchUserFollowing() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            /*  
                onSnapshot 은 리스너이다. 

                DB의 변경된 요소들을 실시간으로 반영하여 양방향 바인딩이 가능함.
                onSnapshot으로 호출된 콜백 함수는 함수가 종료 되어도 계속 실행되기 때문에 서버의 데이터 변경 정보를 계속 수신해서 반영한다.
                (주의)  onSnapshot으로 호출된 콜백 함수는 계속 실행되기(Listening) 때문에 필요하지 않을 경우에는 사용을 중지해야 한다.
            */
            .onSnapshot((snapshot) => {
                let following = snapshot.docs.map(doc => {
                    const id = doc.id;
                    return id
                })
                dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following })
                for(let i = 0; i < following.length; i++) {
                    dispatch(fetchUserData(following[i]));
                }
            })
    })
}

export function fetchUserData(uid) {
    return ((dispatch, getState) => {
        const isCorrectUsersUid = (element) => element.uid === uid;
        const found = getState().usersState.users.some(isCorrectUsersUid);

        if (!found) {
            firebase.firestore()
                .collection("users")
                .doc(uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        let user = snapshot.data();
                        user.uid = snapshot.id;

                        dispatch({ type: USERS_DATA_STATE_CHANGE, user });
                        dispatch(fetchUsersFollowingPosts(user.id));
                    }
                    else {
                        console.log('does not exist')
                    }
                })
        }
    })
}

export function fetchUsersFollowingPosts(uid) {
    return ((dispatch, getState) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                const uid = snapshot.query.EP.path.segments[1];
                console.log({ snapshot, uid });

                const isCorrectUsersUid = (element) => element.uid === uid;
                const user = getState().usersState.users.find(isCorrectUsersUid);
                // .some() 의 리턴은 boolean, .find()의 리턴은 Object로 반환..

                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data, user }
                })
                console.log(posts)
                dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid })
                console.log(getState())
            })
    })
}