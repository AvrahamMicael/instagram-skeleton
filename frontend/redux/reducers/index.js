import userReducer from './user';
import usersReducer from './users';

const combinedReducers = {
    userState: userReducer,
    usersState: usersReducer,
};

export default combinedReducers;
