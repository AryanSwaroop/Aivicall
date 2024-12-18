
// Base URL (can be adjusted for different environments)
const BASE_URL_FRONT = "https://aivicall.vercel.app/";
const BASE_URL_BACK = "https://aivicall.onrender.com";
const BASE_ORIGIN_FRONT = "aivicall.vercel.app";
const BASE_ORIGIN_BACK = "aivicall.onrender.com";

const API_ENDPOINTS = {
  FRONT_URL: `${BASE_URL_FRONT}` ,
  GET_MEET_CODE: `${BASE_URL_BACK}/meet/meetCode`,
  FRONT_ORIGIN : `${BASE_ORIGIN_FRONT}`,
  BACK_ORIGIN : `${BASE_ORIGIN_BACK}`,
  BACK_CALLBACK : `${BASE_URL_BACK}/auth/google/callback`,
  AI_POST_ROUTE: `${BASE_URL_BACK}/ai/generate`
};


export default API_ENDPOINTS;
