import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../styles/Home.module.css";
import NavbarMain from '../components/NavbarMain';
import Container from 'react-bootstrap/Container';




import { Row, Col } from 'react-bootstrap'
function About() {
  
  return (
    <div>
        <NavbarMain/>

        <Container  style={{minHeight: "80vh"}} className="mb-3">
          <Row className="h-100" xs={1} md={2} lg={2}>
            <Col className=" d-flex flex-column justify-content-center align-items-center p-0">
              <img className={styles.image} src="./cryptodevs/2.svg" />
            </Col>
            <Col className=" d-flex flex-column justify-content-center align-items-center text-center align-items-md-start text-md-start  ps-md-5">
              <h1 className="mb-2">Hello Fam 👋!</h1>
              <h3 className="fw-light mb-1">My name is Alan Pelayo, aka apcodes.eth, 
                I´m a Mechatronic Engineer from 🇲🇽, mainly focus in Python and web3.
                I did this NFT minting and whitelist project to practice my skills in web3, so if you want 
                to take a look at the code, the repo is down here 👇.</h3>
                <div className='d-flex'>
                    <h5 className='me-3'><a href='https://github.com/alanpelayoo/FatedEth' target="_blank" rel="noreferrer">Github</a></h5>
                    <h5><a href='https://www.linkedin.com/in/alan-pelayo-zepeda-a91494253/' target="_blank" rel="noreferrer">Linkedin</a></h5>
                </div>
                  
            </Col>
          </Row>
        </Container>
    </div>
  )
}

export default About