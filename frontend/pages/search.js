import axios from "axios";
import React, { useState, useEffect } from "react";
import styles from "../styles/search.module.css";
import withAuth from "../components/withAuth";
import Navbar from "../components/navbar";
import config from "../config/config";

const URL = `${config.URL}/projects`;

const admin = ({ token }) => {
  const [user, setUser] = useState({});
  const [projects, setProjects] = useState({});
  const [project, setProject] = useState({});


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

  const getproject = async (id) => {
    const result = await axios.get(`${config.URL}/${id}`)
    console.log('project id: ', result.data)
    setProject(result.data)
  }

  const getProjects = async () => {
    let result = await axios.get(`${config.URL}/projects`);
    setProjects(result.data.list);
  };

  const showProjects = () => {
    if (projects && projects.length) {
      return projects.map((item, index) => {
        return (
          <div className={styles.listItem} key={index}>
            <div><b>ProjectID :  {item.id}</b></div>
            <div className={styles.edit_button}>
              <button
                className={styles.button_get}
                onClick={() => getproject(item.id)}
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
      <div className={styles.list}>{showProjects()}</div>
      <div className={styles.list1}>
        <div><b>Subject code:</b> {item.subjectcode} <br /></div>
        <div><b>Subject name:</b> {item.subjectname} <br /></div>
        <div><b>Work name:</b> {item.workname} <br /></div>
        <div><b>Deadline:</b> {item.deadline}</div>
        <div><b>Type:</b> {item.type}</div>
      </div>
    </div>
  );
};
export default withAuth(admin);

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}
