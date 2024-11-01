import apiClient from "./services.js";

export default {
  loginUser(user) {
    return apiClient.post("login", user)
      .then(response => response)
      .catch(error => {
        console.error("Login error:", error);
        throw error; // rethrow to allow the calling component to handle
      });
  },
  authorizeUser(code) {
    return apiClient.post("authorize", code);
  },
  logoutUser(token) {
    return apiClient.post("logout", token);
  },
};

