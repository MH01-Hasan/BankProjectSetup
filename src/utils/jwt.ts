import { jwtDecode } from "jwt-decode";

export const decodedToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};
