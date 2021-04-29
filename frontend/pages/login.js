import Head from "next/head";
import Layout from "../components/layout";
import { useState } from "react";
import Navbar from "../components/navbar";
import styles from "../styles/Home.module.css";
import axios from "axios";
import config from "../config/config";
import {Input} from 'antd'
export default function Login({ token }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [remember, setRemember] = useState(false);
  const login = async (req, res) => {
    try {
      let result = await axios.post(`${config.URL}/login`, { username, password, remember }, { withCredentials: true });
      console.log("result: ", result);
      console.log("result.data:  ", result.data);
      console.log("token:  ", token);
      localStorage.setItem('token',result.data.token)
      setStatus(result.status + ": " + result.data.user.username);
    }
    catch (e) {
      console.log("error: ", JSON.stringify(e.response));
      setStatus(JSON.stringify(e.response).substring(0, 80) + "...");
    }
  };
  const reMem = async () => {
    setRemember(!remember);
  };

  const loginForm = () => (
    <div className={styles.gridContainer}>
      <div><b>Username:</b></div>
      <div>
        <Input
          type="text"
          name="username"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div><b>Password:</b></div>
      <div>
        <Input
          type="password"
          name="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex items-center">
        <Input
          id="remember_me"
          name="remember_me"
          type="checkbox"
          onClick={reMem}
        />
      </div>
      <div className={styles.text}><label><ins><i><b>Remember Me</b></i></ins></label></div>
    </div>
  )
  return (
    <Layout>
      <Head>
        <title>Login Page</title>
      </Head>
      <div className={styles.container}>
        <Navbar />
        <h1>Login</h1>
        <br />
        {loginForm()}
        <div>Status: {status}</div>
        <div>
          <button className={styles.btn2} onClick={login}>Login</button>
        </div>
      </div>
    </Layout>
  );
}

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}
