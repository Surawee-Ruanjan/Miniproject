import axios from "axios";
import React, { useState, useEffect } from "react";
import styles from "../styles/search.module.css";
import withAuth from "../components/withAuth";
import Navbar from "../components/navbar";
const URL = `${config.URL}/houses`;
const admin = ({ token }) => {
  const [user, setUser] = useState({});
  const [houses, setHouses] = useState({});
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [date, setDate] = useState("");
  const [date2, setDate2] = useState("");
  const [price, setPrice] = useState(0);
  const [house, setHouse] = useState({});
  const [actionbut, setactionbut] = useState(false)
  const [butstatus, setbutstatus] = useState(false)


  const profileUser = async () => {
    try {

      const users = await axios.get(`${config.URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(users.data);
    } catch (e) {
      console.log(e);
    }
  };

  const gethouse = async (id) => {
    const result = await axios.get(`${config.URL}/${id}`)
    console.log('house id: ', result.data)
    setHouse(result.data)
  }

  const getHouses = async () => {
    let result = await axios.get(`${config.URL}/houses`);
    setHouses(result.data.list);
  };

  const showHouses = () => {
    if (houses && houses.length) {
      return houses.map((item, index) => {
        return (
          <div className={styles.listItem} key={index}>
            <div><b>HouseID :  {item.id}</b></div>
            <div className={styles.edit_button}>
              <button
                className={styles.button_get}
                onClick={() => gethouse(item.id)}
              >
                Get
              </button>
            </div>
          </div>
        );
      });
    } else {
      return <p>Loading...</p>;
    }
  };
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.list}>{showHouses()}</div>
      <div className={styles.list1}>
        <b>Name : {house.name}</b>
        <b>Age : {house.age}</b>
        <b>Deposit Date : {house.date}</b>
        <b>Pick-up Date : {house.date2}</b>
        <b>Price : {house.price}</b>
      </div>
    </div>
  );
};
export default withAuth(admin);

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}
