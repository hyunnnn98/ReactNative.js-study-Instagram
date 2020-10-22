// Reducer 의 역할은 해당 상태를 저장하고, 업데이트를 반영해준다.

import { combineReducers } from 'redux'
import { user } from './user'

const Reducers = combineReducers({
    userState: user
})

export default Reducers