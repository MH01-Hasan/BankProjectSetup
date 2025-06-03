import { authKey } from "@/constants/storageKey";
import { instance as axiosInstance } from "@/helpers/axios/axiosInstance";
import { getBaseUrl } from "@/helpers/config/envConfig";
import { decodedToken } from "@/utils/jwt";
import { getFromLocalStorage, setToLocalStorage } from "@/utils/local-storage";

export const storeUserInfo = ({ accessToken }: { accessToken: string }) => {
    setToLocalStorage(authKey, accessToken);
};

export const getUserInfo = () => {
    const authToken = getFromLocalStorage(authKey);
    if (authToken) {
        const decodedData = decodedToken(authToken);
        return decodedData;
    } else {
        return {};
    }
};

export const isLoggedIn = () => {
    const authToken = getFromLocalStorage(authKey);
    if (authToken) {
        // const decodedData = decodedToken(authToken);
        // const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        // if (decodedData?.exp && decodedData.exp < currentTime) {
        //     handleLogout(); // Token is expired, log out the user
        //     return false;
        // }
        return true;
    }
    return false;
};

export const removeUserInfo = (key: string) => {
    localStorage.removeItem(key);
};

export const getNewAccessToken = async () => {
    try {
        const response = await axiosInstance({
            url: `${getBaseUrl()}/auth/refresh-token`,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        });
        if (response?.data?.accessToken) {
            storeUserInfo({ accessToken: response.data.accessToken });
            return response.data.accessToken;
        }
    } catch (error) {
        console.error("Failed to refresh token:", error);
        handleLogout(); // Log out if refresh token fails
        throw error;
    }
};

export const handleLogout = () => {
    removeUserInfo(authKey); // Clear token from local storage
    // Redirect to login page or show a logout message
    window.location.href = "/login"; 
};
