import { watchAuthState } from "./auth.js";
import { auth } from "./firebase.js";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

// すでにログイン済みならmainに飛ばす
watchAuthState(
  (user) => {
    window.location.href = "./main.html";
  },
  () => {
    /* 何もしない */
  },
);

document.getElementById("loginGoogle").addEventListener("click", async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    window.location.href = "./main.html";
  } catch (e) {
    alert("ログインに失敗");
  }
});

document.getElementById("loginGithub").addEventListener("click", async () => {
  try {
    const provider = new GithubAuthProvider();
    await signInWithPopup(auth, provider);
    window.location.href = "./main.html";
  } catch (e) {
    console.error(e);
    alert("ログインに失敗");
  }
});
