import React, { useState } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'

import firebase from 'firebase';
require('firebase/firestore');

export default function Search({ navigation}) {
    // 검색 된 유저들의 정보 저장
    const [users, setUsers] = useState([])

    const fetchUsers = (search) => {
        firebase.firestore()
            .collection('users')
            .where('name', '>=', search)
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                });
                setUsers(users);
            })
    }

    // 다음 부터는 아래 형태로 공통 작업 컴포넌트는 따로 빼서 함수형태로 관리하자.
    const userInfo = (item) => {
        return (
            <View style={{ margin: 3 }}>
                <TouchableOpacity
                    // navigate 함수로 원하는 페이지에 파일을 넘겨줄수 있다.
                    onPress={() => navigation.navigate("Profile", { uid: item.id })}>
                    <Text style={{ backgroundColor: 'red', paddingVertical: 20, textAlign: 'center' }}>{item.name}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const isSearchMode = users.length == 0


    return (
        <View>
            <TextInput
                style={{ padding: 10, margin: 10, borderWidth: 1, borderColor: 'black', borderRadius: 5, fontSize: 13 }}
                placeholder="사용자 이름을 입력해주세요."
                onChangeText={(search) => fetchUsers(search)} />
            { isSearchMode ?
                (
                    <View><Text>검색을 하지 않았습니다.</Text></View>
                ) : null
            }
            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({ item }) => userInfo(item)}
            />
        </View>
    )
}
