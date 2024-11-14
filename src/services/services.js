import axios from 'axios';
import Utils from '../config/utils.js';
import AuthServices from './authServices.js';
import Router from '../router.js';

// Define the base URL based on the environment
var baseurl = import.meta.env.DEV ? "http://localhost:3029/resume-t9" : "/resume-t9/";

const apiClient = axios.create({
  baseURL: baseurl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Origin': '*',  // Ensure this is set correctly in backend as well
    crossDomain: true,
  },
  // Intercept the request to add the token if it exists
  transformRequest: (data, headers) => {
    const user = Utils.getStore('user'); // Or use localStorage or another utility for getting the user
    if (user && user.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }
    return JSON.stringify(data);
  },
  // Handle response data and errors
  transformResponse: function (data) {
    try {
      // Parse the response data to JSON
      data = JSON.parse(data);

      // Check if the response indicates an unauthorized error
      if (data.message && data.message.includes('Unauthorized')) {
        // If unauthorized, log the user out and redirect to login page
        AuthServices.logoutUser(Utils.getStore('user'))
          .then(() => {
            Utils.removeItem('user'); // Clear the stored user
            Router.push({ name: 'login' }); // Redirect to login page
          })
          .catch(error => console.error('Logout error:', error));
      }

      return data;  // Return the parsed data
    } catch (error) {
      // Log any error that occurs during response parsing
      console.error("Error parsing response as JSON:", error);
      console.error("Raw response:", data); // Log the raw response for easier debugging
      throw new Error("Unexpected response format from the server.");
    }
  },
});

export default apiClient;
