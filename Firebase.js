import { initializeApp } from "firebase/app";
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut} from "firebase/auth";
// import {getFirestore} from "firebase/getFirestore";
import {getFirestore, addDoc, collection} from "firebase/firestore";
import { toast } from "react-toastify";


const firebaseConfig = {
  apiKey: "AIzaSyDx3ZnnKb8IOWDB8ejUS-9xrEw6St4osWA",
  authDomain: "netflix-clone-df82e.firebaseapp.com",
  projectId: "netflix-clone-df82e",
  storageBucket: "netflix-clone-df82e.firebasestorage.app",
  messagingSenderId: "287287320662",
  appId: "1:287287320662:web:2be66a6da2a873e06c5bf7"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db= getFirestore(app);

const signup= async (name, email, password)=>{
try {
    const res= await createUserWithEmailAndPassword(auth,email, password);
    const user= res.user;
    await addDoc(collection(db, "user"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
     })
} catch (error) {
    console.log(error);
     toast.error(error.code.split('/')[1].split('-').join(" "));
}

};
const login= async (email, password)=>{
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.log(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));

    }
};
const logout =()=>{
    signOut(auth);
};
export {auth, db, login ,signup, logout};