// state 의 초가값에 대한 설정을 하기 위해 obejct 형태의 default 값을 넣어
// 코드 로딩중에 nullbale 이 발생하는 오류를 막아준다.
const initialState = {
    currentUser: null
}

export const user = (state = initialState, action) => {
    return {
        ...state,
        currentUser: action.currentUser
    }
}