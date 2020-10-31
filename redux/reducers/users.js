import { USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE } from "../constants"

const initialState = {
    users: [],
    userLoaded: 0,  // 팔로워수
}

export const users = (state = initialState, action) => {
    // switch 구문으로 작업할 시 반드시 default 로 현재의 state 를 리턴해야 한다.
    switch (action.type) {
        case USERS_DATA_STATE_CHANGE:
            return {
                ...state,
                users: [...state.users, action.user]
                // 기존 users 배열에 새로운 유저 객체를 하나 더 추가하는 형식으로
                // deep copy 를 통해 이전 array는 다른 새로운 array를 통해 상태비교를 할 수 있는 장점이 있다.
                // [...OriginalArr, Object] 형태의 구문 반드시 기억하자. 자주 이용할듯하네.
            }
        case USERS_POSTS_STATE_CHANGE:
            return {
                ...state,
                userLoaded: state.userLoaded + 1,
                users: state.users.map(user => user.uid === action.uid ?
                    { ...user, posts: action.posts } : user)
            }
        default:
            return state;
    }
}