// Reducer 의 역할은 해당 상태를 저장하고, 업데이트를 반영해준다.

import { combineReducers } from 'redux'
import { user } from './user'
import { users } from './users'

// 여기서 store.Xxx 로 넘겨주는 최종 루트가 결정된다.
const Reducers = combineReducers({
    userState: user,
    usersState: users,
})

export default Reducers