let isDev = true;
export const BACKEND_URL = isDev ? "http://localhost:8080" : "someurl";

export const Config = {
  SIGN_UP: BACKEND_URL + "/auth/signup",
  SIGN_IN: BACKEND_URL + "/auth/signin",
  VERIFYJWT: BACKEND_URL + "/auth/verify",
  CREATESESSION: BACKEND_URL + "/schedule/createsession",
};
