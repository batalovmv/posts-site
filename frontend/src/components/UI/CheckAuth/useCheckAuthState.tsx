import { useEffect } from "react";
import { useAppDispatch } from "../../../store/hooks";
import  {  loginUser, logoutUser, setAuthLoading } from "../../../features/user/userSlice";
import { JwtPayload, jwtDecode } from "jwt-decode";

const useCheckAuthState = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        async function checkAuthState() {
            const userInfoString = localStorage.getItem('userInfo');
            console.log('userInfoString', userInfoString)
            if (userInfoString) {
                const userInfo = JSON.parse(userInfoString);
                console.log(`userInfoString`, userInfoString);
                const token = userInfo?.token;
                console.log(`token`, token);
                const refreshToken = userInfo?.refreshToken; 
                console.log(`refreshToken`, refreshToken);

                if (token && refreshToken) {
                    try {
                        console.log('Attempting to refresh token or login user...');
                        const decodedToken = jwtDecode<JwtPayload>(token);
                        // Если токен истек, но есть refreshToken, попытаемся обновить токен
                        console.log(`decodedToken`, decodedToken);
                        if (decodedToken.exp && typeof decodedToken.exp === 'number' && Date.now() >= decodedToken.exp * 1000) {
                            console.log(`refreshToken`, refreshToken);
                            dispatch(refreshToken({ refreshToken }));
                            console.log('Dispatched action for refreshing token or logging in user.1');
                        } else {
                            console.log(`userInfo`, userInfo);
                            dispatch(loginUser(userInfo));
                            console.log('Dispatched action for refreshing token or logging in user.2');
                        }
                    } catch (error) {
                        console.error('Token decode failed:', error);
                        dispatch(logoutUser());
                        dispatch(setAuthLoading(false));
                        
                        console.error('Error during token refresh or user login:', error);
                    }
                } else {
                    console.error('Token decode failed 2:');
                    dispatch(setAuthLoading(false));
                    dispatch(logoutUser());
                }
            } else {
                console.error('Token decode failed 3:');
                dispatch(setAuthLoading(false));
                dispatch(logoutUser());
            }
        }

        checkAuthState();
    }, [dispatch]);

    
};

export default useCheckAuthState;