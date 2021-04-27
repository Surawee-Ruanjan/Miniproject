import Head from 'next/head'
import Layout from '../components/layout'
import useSWR, { mutate } from "swr";
import axios from "axios";
import React, { } from "react";
import styles from "../styles/Index.module.css";
import Navbar from "../components/navbar";
// const URL = `${config.URL}/houses`;
// const URL_SEL = `${config.URL}/purchase`;
const fetcher = (key) => fetch(key).then((res) => res.json());
const index = () => {
  const { data, error } = useSWR(URL, fetcher, { revalidateOnFocus: false });
  if (error) return <div>failed to load</div>;
  if (!data) return <div>Loading...</div>;
  console.log("data", data);

  const selStu = async (id) => {
    let result = await axios.post(`${config.URL}/${id}`)
    mutate(URL, data);
  }

  const showHouses = () => {
    if (data.list && data.list.length) {
      return data.list.map((item, index) => {
        return (
          <div className={styles.listItem} key={index}>
            <div><b>Name : {item.name}</b> </div>
            <div><b>Age : {item.age}</b> </div>
            <div><b>Deposit Date : {item.date}</b>  </div>
            <div><b>Pick-up Date : {item.date2}</b> </div>
            <div><b>Price : {item.price}</b> </div>
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
      <div className={styles.container}><Navbar />

        <div className={styles.house}>Cat House</div>


        <div className={styles.message}>Because your cat is important So we take care of it like family members. Give love and care The best. 💕
<br />Rule<br />

1.With a camera to view youngsters 24 hours a day<br />
2.Free good quality cat litter<br />
3.Free cat fountain and filtered water NSF standards<br />
4.With AC 24 hours<br />
4.With air purifier 24 hours a day<br />
5.With rooms, shady garden views, with birds to see all day<br />
Price<br/>
Per Day : 250 baht<br />
Per Month : 6000 baht<br />

This price includes cat litter. A fountain with drinking water that is NSF standards. Ready to turn on the air conditioner and air purifier 24 hours a day
Welcome all customers<br />


        </div>
        <div className={styles.list}>
          {showHouses()}
        </div>

      </div>
    </Layout>
  );
};
export default index;
