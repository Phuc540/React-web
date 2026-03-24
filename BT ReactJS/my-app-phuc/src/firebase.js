import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD1wwQkH-Sdh2eXF1I5p23xDtBMYlHe_a0",
  authDomain: "my-app-phuc.firebaseapp.com",
  projectId: "my-app-phuc",
  storageBucket: "my-app-phuc.firebasestorage.app",
  messagingSenderId: "775706927467",
  appId: "1:775706927467:web:b0921e205f7db3e7026c2e",
  measurementId: "G-PLEX3RQRXT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };