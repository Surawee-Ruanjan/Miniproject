import axios from "axios";
import React, { useState, useEffect } from "react";
import styles from "../styles/project.module.css";
import withAuth from "../components/withAuth";
import Navbar from "../components/navbar";
import config from "../config/config";
import { Input } from 'antd'

const URL = `${config.URL}/projects`;

const admin = ({ token }) => {
  const [user, setUser] = useState({});
  const [projects, setProjects] = useState({});
  const [project, setProject] = useState({});
  const [subjectcode, setSubjectcode] = useState("");
  const [subjectname, setSubjectname] = useState("");
  const [workname, setWorkname] = useState("");
  const [deadline, setDeadline] = useState("");
  const [type, setType] = useState("");
  const [actionbut, setactionbut] = useState(false)
  const [butstatus, setbutstatus] = useState(false)

  useEffect(() => {
    getProjects();
    if (projects.length === 9) {
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

  const getProjects = async () => {
    let result = await axios.get(URL);
    setProjects(result.data.list);
  };
  const getproject = async (id) => {
    const result = await axios.get(`${URL}/${id}`)
    console.log('project id: ', result.data)
    setProject(result.data)
  }

  const addProject = async () => {
    let result = await axios.post(URL, {
      subjectcode,
      subjectname,
      workname,
      deadline,
      type,
    });
    console.log(result);
    getProjects();
  };

  const deleteProject = async (id) => {
    let result = await axios.delete(`${URL}/${id}`);
    getProjects();
  };

  const updateProject = async (id) => {
    let result = await axios.put(`${URL}/${id}`, {
      subjectcode,
      subjectname,
      workname,
      deadline,
      type,
    });
    console.log(result);
    getProjects();
  };

  const showProjects = () => {
    if (projects && projects.length) {
      return projects.map((item, index) => {
        return (
          <div className={styles.listItem} key={index}>

            <div><b>ProjectID:</b> {item.id}</div>
            <div><b>Subject code:</b> {item.subjectcode} <br /></div>
            <div><b>Subject name:</b> {item.subjectname} <br /></div>
            <div><b>Work name:</b> {item.workname} <br /></div>
            <div><b>Deadline:</b> {item.deadline}</div>
            <div><b>Type:</b> {item.type}</div>

            <div className={styles.edit_button}>
              <button
                className={styles.button_get}
                onClick={() => getproject(item.id)}
              >
                Get
              </button>
            </div>
            <div className={styles.edit_button}>
              <button
                className={styles.button_update}
                onClick={() => updateProject(item.id)}
              >
                Update
              </button>
              <button
                className={styles.button_delete}
                onClick={() => {
                  setactionbut(!actionbut)
                  deleteProject(item.id)
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
      <h1><ins>Project Management</ins></h1>
      <div className={styles.form_add}>
        Subject Code:
        <Input
          type="text"
          name="subjectcode"
          onChange={(e) => setSubjectcode(e.target.value)}
        ></Input>
      Subject Name:
        <Input
          type="text"
          name="subjectname"
          onChange={(e) => setSubjectname(e.target.value)}
        ></Input>
        Work name:
        <Input
          type="text"
          name="workname"
          onChange={(e) => setWorkname(e.target.value)}
        ></Input>
        Deadline:
        <Input
          type="text"
          name="deadline"
          onChange={(e) => setDeadline(e.target.value)}
        ></Input>
        Type:
        <Input
          type="text"
          name="type"
          onChange={(e) => setType(e.target.value)}
        ></Input>
        <button
          className={styles.button_add}
          disabled={butstatus}
          onClick={() => {
            addProject(subjectcode, subjectname, workname, deadline, type)
            setactionbut(!actionbut)
          }
          }
        >
          Add Work
        </button>
      </div>
      <div className={styles.list}>{showProjects()}</div>
      <div className={styles.list1}>

        <div><b>Subject code:</b> {project.subjectcode} <br /></div>
        <div><b>Subject name:</b> {project.subjectname} <br /></div>
        <div><b>Work name:</b> {project.workname} <br /></div>
        <div><b>Deadline:</b> {project.deadline}</div>
        <div><b>Type:</b> {project.type}</div>

      </div>


    </div>

  );
};

export default withAuth(admin);

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}
