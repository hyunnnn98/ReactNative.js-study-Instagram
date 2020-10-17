import React from 'react'
import { Text, View, Button } from 'react-native'


// @react-navigation/native 로 부터 받아오는 NavigationContainer 에서 props 로
// navigation 을 받아 라우팅을 연결해준다.
export default function Landing({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Button 
                title="Register"
                onPress={() => navigation.navigate("Register")}/>
            <Button 
                title="Login"
                onPress={() => navigation.navigate("Login")}/>
        </View>
    )
}
