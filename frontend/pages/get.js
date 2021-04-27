import axios from "axios";
import React, { useState, useEffect } from "react";
import styles from "../styles/get.module.css";
import withAuth from "../components/withAuth";
import Navbar from "../components/navbar";
const URL = "http://localhost/api/houses";
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

  useEffect(() => {
    getHouses();
    if (houses.length === 9) {
      setbutstatus(true)
    } else setbutstatus(false)
    profileUser();
  }, [actionbut]);

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
    const result = await axios.get(`${URL}/${id}`)
    console.log('house id: ', result.data)
    setHouse(result.data)
  }

  const getHouses = async () => {
    let result = await axios.get(URL);
    setHouses(result.data.list);
  };

  const addHouse = async () => {
    let result = await axios.post(URL, {
      name,
      age,
      date,
      date2,
      price,
    });
    console.log(result);
    getHouses();
  };

  const deleteHouse = async (id) => {
    let result = await axios.delete(`${URL}/${id}`);
    getHouses();
  };

  const updateHouse = async (id) => {
    let result = await axios.put(`${URL}/${id}`, {
      name,
      age,
      date,
      date2,
      price,
    });
    console.log(result);
    getHouses();
  };

  const showHouses = () => {
    if (houses && houses.length) {
      return houses.map((item, index) => {
        return (
          <div className={styles.listItem} key={index}>
            <div><b>HouseID:</b> {item.id}</div>
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
      <h1><ins>History</ins></h1>

      <div className={styles.list}>{showHouses()}</div>
      <div className={styles.list1}><b>(selected House):</b>
        <b>Name:</b>{house.name}
        <b>Age:</b>{house.age}
        <b>Deposit Date:</b>{house.date}
        <b>Pick-up Date:</b>{house.date2}
        <b>Price:</b>{house.price}
      </div>
    </div>
  );
};
export default withAuth(admin);

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}
