import axios from "axios";
import React, { useState, useEffect } from "react";
import styles from "../styles/house.module.css";
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
            <div><b>Name:</b> {item.name} <br /></div>
            <div><b>Age:</b> {item.age} <br /></div>
            <div><b>Deposit Date:</b> {item.date} <br /></div>
            <div><b>Pick-up Date:</b> {item.date2}</div>
            <div><b>Price:</b> {item.price}</div>
            <div className={styles.edit_button}>
              <button
                className={styles.button_update}
                onClick={() => updateHouse(item.id)}
              >
                Update
              </button>
              <button
                className={styles.button_delete}
                onClick={() => {
                  setactionbut(!actionbut)
                  deleteHouse(item.id)
                }}
              >
                Delete
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
      <h1><ins>House Management</ins></h1>
      <div className={styles.form_add}>
      Name:
        <input
          type="text"
          name="name"
          onChange={(e) => setName(e.target.value)}
        ></input>
        Age:
        <input
          type="number"
          name="age"
          onChange={(e) => setAge(e.target.value)}
        ></input>
        Deposit Date:
        <input
          type="text"
          name="date"
          onChange={(e) => setDate(e.target.value)}
        ></input>
        Pick-up Date:
        <input
          type="text"
          name="date2"
          onChange={(e) => setDate2(e.target.value)}
        ></input>
        Price:
        <input
          type="number"
          name="price"
          onChange={(e) => setPrice(e.target.value)}
        ></input>
        <button
          className={styles.button_add}
          disabled={butstatus}
          onClick={() => {
            addHouse(name, age, date, date2, price)
            setactionbut(!actionbut)
          }
          }
        >
          Add Animals
        </button>


      </div>

      <div className={styles.list}>{showHouses()}</div>
    </div>
  );
};
export default withAuth(admin);

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}
