import { initializeApp } from "firebase/app";
import {getStorage} from   "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA0bRwVrwhTcboJqoVsrkLAjx5dmI4WUZM",
    authDomain: "multiverse-admin.firebaseapp.com",
    projectId: "multiverse-admin",
    storageBucket: "multiverse-admin.appspot.com",
    messagingSenderId: "544286053119",
    appId: "1:544286053119:web:13e85ca085b5c7ad8bb2ca",
    measurementId: "G-LVMZVXS55C"
  };

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);



