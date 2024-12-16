
// Base URL (can be adjusted for different environments)
const BASE_URL_FRONT = process.env.react_frontend || "http://localhost:3000";
const BASE_URL_BACK = process.env.react_backend || "http://localhost:5000";
const BASE_ORIGIN_FRONT = process.env.origin_frontend || "localhost:3000";
const BASE_ORIGIN_BACK = process.env.origin_backend || "localhost:5000";

const API_ENDPOINTS = {
  FRONT_URL: `${BASE_URL_FRONT}` ,
  GET_MEET_CODE: `${BASE_URL_BACK}/meet/meetCode`,
  FRONT_ORIGIN : `${BASE_ORIGIN_FRONT}`,
  BACK_ORIGIN : `${BASE_ORIGIN_BACK}`,
  BACK_CALLBACK : `${BASE_URL_BACK}/auth/google/callback`,
  AI_POST_ROUTE: `${BASE_URL_BACK}/ai/generate`
};


export default API_ENDPOINTS;
