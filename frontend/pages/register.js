import { useState } from 'react'
import Head from 'next/head'
import Layout from '../components/layout'
import styles from '../styles/Home.module.css'
import Navbar from '../components/navbar'
import axios from 'axios'
import config from '../config/config'

export default function Register({ token }) {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [position, setPosition] = useState('')
    const [status, setStatus] = useState('')

    const profileUser = async () => {
        console.log('token: ', token)
        const users = await axios.get(`${config.URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        console.log('user: ', users.data)
    }

    const register = async (req, res) => {
        try {
            let result = await axios.post(`${config.URL}/register`,
                { username, email, name, position, password })
            console.log('result: ', result)
            console.log('result.data:  ', result.data)
            console.log('token:  ', token)
            setStatus(result.data.message)
        }
        catch (e) {
            console.log(e)
        }

    }

    const registerForm = () => (
        <div className={styles.gridContainer}>
            <div>
                <b>Username:</b>
            </div>
            <div>
                <input type="text"
                    name="username"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <b>Name:</b>
            </div>
            <div>
                <input type="text"
                    name="name"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <b>Email:</b>
            </div>
            <div>
                <input type="email"
                    name="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <b>Position:</b>
            </div>
            <div>
                <input type="text"
                    name="position"
                    placeholder="Your Position"
                    onChange={(e) => setPosition(e.target.value)} />
            </div>
            <div>
                <b>Password:</b>
            </div>
            <div>
                <input type="password"
                    name="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)} />
            </div>

        </div>
    )


    return (
        <Layout>
            <Head>
                <title>Register Page</title>
            </Head>
            <div className={styles.container}>
                <Navbar />
                <h1>Staff Register Only</h1>
                <br /><br />
                <div className={styles.content}>
                    {registerForm()}
                </div>
                <b>Status: </b> <i>{status}</i>
                <div>
                    <button className={styles.btn}
                        onClick={register}>Register</button>
                </div>
            </div>
        </Layout>
    )
}

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}
