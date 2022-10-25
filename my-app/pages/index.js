import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../styles/Home.module.css";
import NavbarMain from '../components/NavbarMain';
import Container from 'react-bootstrap/Container';


import { useEffect, useRef, useState } from 'react';
import { Contract, providers, utils } from "ethers";
import { abi2, NFT_CONTRACT_ADDRESS } from "../constants";
import Web3Modal from "web3modal";

import { Row, Col } from 'react-bootstrap'
function mint() {
  const [presaleStarted, setPresaleStarted] = useState(true);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [numTokensMinted, setNumTokensMinted] = useState("");
  const web3ModalRef = useRef();

  const getNumMintedTokens = async () => {
    try {
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi2, provider);
      const numTokenIds = await nftContract.tokenIds();
      setNumTokensMinted(numTokenIds.toString());

    } catch (error) {
      console.error(error);
    }
  };

  const presaleMint = async () => {
    setLoading(true);
      try {
        const signer = await getProviderOrSigner(true);
        const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi2, signer);
        
        const txn = await nftContract.presaleMint({
          value: utils.parseEther("0.01"),
        });
        await txn.wait();
        window.alert("You succesfully minted a Cryptodev!");
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
  };

  const publicMint = async () =>{
    setLoading(true);
    try {
      const signer = await getProviderOrSigner(true);
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi2, signer);
      
      const txn = await nftContract.mint({
        value: utils.parseEther("0.01"),
      });
      
      await txn.wait();
      window.alert("You succesfully minted a Cryptodev!");
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const getOwner = async () => {
    try {
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi2, provider);
      // call the owner function from the contract
      const _owner = await nftContract.owner();
      // We will get the signer now to extract the address of the currently connected MetaMask account
      const signer = await getProviderOrSigner(true);
      // Get the address associated to the signer which is connected to  MetaMask
      const address = await signer.getAddress();
      if (address.toLowerCase() === _owner.toLowerCase()) {
        setIsOwner(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startPresale = async () => {
    try {
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const whitelistContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        abi2,
        signer
      );
      // call the startPresale from the contract
      const tx = await whitelistContract.startPresale();
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      // set the presale started to true
      await checkIfPresaleStarted();
    } catch (err) {
      console.error(err);
    }
  };

  const checkIfPresaleEnded = async () =>{
    try {
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi2, provider);

      const presaleEndTime = await nftContract.presaleEnded();
      const currentTimeInSeconds = Date.now() / 1000;

      const hasPresaleEnded = presaleEndTime.lt(
        Math.floor(currentTimeInSeconds)
        );
      setPresaleEnded(hasPresaleEnded);

    } catch (error) {
      console.error(error);
    }
  };

  const checkIfPresaleStarted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi2, provider);

      const _presaleStarted = await nftContract.presaleStarted();
      setPresaleStarted(_presaleStarted);
      return _presaleStarted;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const connectWallet = async() => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
    
  };

  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Rinkeby network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  //updates with refresh
  const onPageLoad = async () => {
    await connectWallet();
    await getOwner();
    const presaleStarted = await checkIfPresaleStarted();
    if(presaleStarted){
      await checkIfPresaleEnded();
    }
    await getNumMintedTokens();
    // tracks in real time
    setInterval(async() => {
      await getNumMintedTokens();
    }, 5*1000);

    setInterval(async() => {
      const presaleStarted = await checkIfPresaleStarted();
      if (presaleStarted) {
        await checkIfPresaleEnded();
      }
    },5*1000);
  };

  useEffect(() => {
    if(!walletConnected){
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      onPageLoad();
    }
  }, [walletConnected])

  const renderButton = () => {
    // If wallet is not connected, return a button which allows them to connect their wllet
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }

    // If we are currently waiting for something, return a loading button
    if (loading) {
      return <button className={styles.button}>Loading...</button>;
    }
    // If connected user is the owner, and presale hasnt started yet, allow them to start the presale
    if (isOwner && !presaleStarted) {
      return (
        <button className={styles.button} onClick={startPresale}>
          Start Presale!
        </button>
      );
    }

    // If connected user is not the owner but presale hasn't started yet, tell them that
    if (!presaleStarted) {
      return (
        <div>
          <div className={styles.description}>Presale hasnt started!</div>
        </div>
      );
    }

    // If presale started, but hasn't ended yet, allow for minting during the presale period
    if (presaleStarted && !presaleEnded) {
      return (
        <div>
          <div className={styles.description}>
            Presale has started!!! If your address is whitelisted, Mint a
            Crypto Dev 🥳
          </div>
          <button onClick={presaleMint} className={styles.button}>Presale Mint</button>
        </div>
      );
    }

    // If presale started and has ended, its time for public minting
    if (presaleStarted && presaleEnded) {
      return (
        <button className={styles.button} onClick={publicMint}>
          Public Mint 🚀
        </button>
      );
    }
    else{
      return(
        null
      );
    };
  };

  return (
    <div>
        <NavbarMain/>

        <Container  style={{minHeight: "80vh"}} className="mb-3">
          <Row className="h-100" xs={1} md={2} lg={2}>
            <Col className=" d-flex flex-column justify-content-center align-items-center p-0">
              <img className={styles.image} src="./cryptodevs/4.svg" />
            </Col>
            <Col className=" d-flex flex-column justify-content-center align-items-center text-center align-items-md-start text-md-start  ps-md-5">
              <h1 className="mb-2">Welcome to FatedEth mint!</h1>
              <h3 className="fw-light mb-1">The NFT collection for developers and fated followers of Eth.</h3>
              <h3 className="fw-lighter mb-2"> {numTokensMinted}/20 nft´s have been minted already!</h3>
              <div className="">
              {renderButton()}
              </div>          
            </Col>
          </Row>
        </Container>
    </div>
  )
}

export default mint