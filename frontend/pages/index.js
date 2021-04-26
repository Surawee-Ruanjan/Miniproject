import Head from 'next/head'
import Layout from '../components/layout'
import useSWR, { mutate } from "swr";
import axios from "axios";
import React, { } from "react";
import styles from "../styles/Index.module.css";
import Navbar from "../components/navbar";
const URL = "http://localhost/api/houses";
const URL_SEL = "http://localhost/api/purchase";
const fetcher = (key) => fetch(key).then((res) => res.json());
const index = () => {
  const { data, error } = useSWR(URL, fetcher, { revalidateOnFocus: false });
  if (error) return <div>failed to load</div>;
  if (!data) return <div>Loading...</div>;
  console.log("data", data);

  const selStu = async (id) => {
    let result = await axios.post(`${URL_SEL}/${id}`)
    mutate(URL, data);
  }

  const showHouses = () => {
    if (data.list && data.list.length) {
      return data.list.map((item, index) => {
        return (
            <div className={styles.listItem} key={index}>
            <div><b>HouseID:</b> {item.id}</div>
            <div><b>Name:</b> {item.name}</div>
            <div><b>Age:</b> {item.age}</div>
            <div> <b>Deposit Date:</b> {item.date} </div>
            <div><b>Pick-up Date:</b> {item.date2}</div>
            <div><b>Price:</b> {item.price}</div>
          </div>
        );
      });
    } else {
      return <p>Loading...</p>;
    }
  };
  return (
    <Layout>
      <Head>
        <title>Home Page</title>
      </Head>
      <div className={styles.house}>Pet House</div>


      <div className={styles.message}>Per Day : 250 baht<p>Per Month : 6000 baht</p>

      </div>
      <div className={styles.container}><Navbar />
        <div className={styles.list}>
            {showHouses()}
        </div>

      </div>
    </Layout>
  );
};
export default index;
