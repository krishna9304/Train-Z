let isDev = true;
export const BACKEND_URL = isDev ? "http://localhost:8080" : "yywsgduchwei";

export const Config = {
  SIGN_UP: BACKEND_URL + "/auth/signup",
  SIGN_IN: BACKEND_URL + "/auth/signin",
};
