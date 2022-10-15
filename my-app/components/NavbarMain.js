import React from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import styles from "../styles/Home.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiscord
} from "@fortawesome/free-brands-svg-icons";

function NavbarMain() {
  return (
    <Navbar bg="white" className="px-5 py-2 mb-2">
        <div className="mx-0 mx-md-5 d-flex justify-content-between align-items-center  w-100 ">
          <h1 className={styles.title}>FatedEth</h1>
          <div className={styles.menu}>
            <a href="/" className={styles.semi}><p className="me-4 fs-5">Home</p></a>
            <a href="" className={styles.semi}><p className="me-4 fs-5">About Us</p></a>
            <a href="" className={styles.semi}><p className="me-4 fs-5">Whitelist</p></a>
            <a href="/mint" className={styles.semi}><p className="me-4 fs-5">Mint</p></a>
            <a href="" className={styles.semi}><p className="me-4 fs-5">Faq</p></a>
          </div>
          <Button className={styles.menub} variant="dark rounded-pill px-4 py-2 d-md-flex align-items-center">Discord <FontAwesomeIcon icon={faDiscord} className="d-flex   ms-2"/> </Button>
          
        </div>
    </Navbar>
  )
}

export default NavbarMain