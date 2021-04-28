import Head from 'next/head'
import Layout from '../components/layout'
import useSWR, { mutate } from "swr";
import axios from "axios";
import React, { } from "react";
import styles from "../styles/Index.module.css";
import Navbar from "../components/navbar";
import config from "../config/config";
const URL = `${config.URL}/projects`;

const fetcher = (key) => fetch(key).then((res) => res.json());
const index = () => {
  const { data, error } = useSWR(URL, fetcher, { revalidateOnFocus: false });
  if (error) return <div>failed to load</div>;
  if (!data) return <div>Loading...</div>;
  console.log("data", data);

  const showProjects = () => {
    if (data.list && data.list.length) {
      return data.list.map((item, index) => {
        return (
          <div className={styles.listItem} key={index}>
            <div><b>ProjectID:</b> {item.id}</div>
            <div><b>Subject code:</b> {item.subjectcode} <br /></div>
            <div><b>Subject name:</b> {item.subjectname} <br /></div>
            <div><b>Work name:</b> {item.workname} <br /></div>
            <div><b>Deadline:</b> {item.deadline}</div>
            <div><b>Type:</b> {item.type}</div>
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
        </div>
        <div className={styles.list}>
          {showProjects()}
        </div>
    </Layout>
  );
};
export default index;
