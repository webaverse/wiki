import React, { useState, useEffect, useContext } from "react";
import classnames from "classnames";
import styles from "./UserBox.module.css";
import CustomButton from "../custom-button";
import Link from "next/link";

// import { ContentObjectContext } from "../../../pages/[contents]/[name]";
import { AccountContext } from "../../hooks/web3AccountProvider";



export const UserBox = ({ className }) => {
    const account = useContext( AccountContext );
    // const loggedIn = false;
    const [ open , setOpen] = useState(false);
    const { isConnected, currentAddress, connectWallet, disconnectWallet, errorMessage, wrongChain, getAccounts, getAccountDetails } = account;
    const [ loggedIn, setLoggedIn] = useState(false);
    const [address, setAddress] = useState('');


    
    const metaMaskLogin = async event => {
        event.preventDefault();
        event.stopPropagation();
        if (!loggedIn) {
            setLoggedIn(true);
            try {
              const walletAddr = await connectWallet();
              if(walletAddr) {
                setAddress(walletAddr)
              }
            } catch (err) {
              console.warn(err);
            } finally {
              setLoggedIn(false);
              setOpen(false)
            }
          }
    };

    const logOut = (event) => {
        event.preventDefault();
        event.stopPropagation();
        disconnectWallet();
        setAddress("");
        setLoggedIn(false);
        setOpen(false)
    }

    
    return (
        <div className={classnames(styles.userBoxWrap, className)}>
            <div className={styles.leftCorner} />
            <div className={styles.rightCorner} />
            <ul>
                <li>
                    <CustomButton
                        type="icon"
                        theme="light"
                        icon="backpack"
                        size={32}
                    />
                </li>
                <li>
                    <a href={"/map"}>
                        <CustomButton
                            type="icon"
                            theme="light"
                            icon="map"
                            size={32}
                        />
                    </a>
                </li>
                {!address && (
                    <>
                        <li>
                            <div className={styles.profileImage}>
                                <div className={styles.image}>
                                    <img src={"/assets/profile-no-image.png"} />
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className={styles.loggedOutText}>
                                Not
                                <br />
                                Logged In
                            </div>
                            <CustomButton
                                type="login"
                                theme="dark"
                                icon="login"
                                size={28}
                                className={styles.loginButton}
                                onClick={() => setOpen(true)}
                            />
                        </li>
                    </>
                )}
                {address && (
                    <>
                        <li>
                            <div className={styles.profileImage}>
                                <div className={styles.image}>
                                    <img
                                        src={"/assets/profile-no-image.png"}
                                        crossOrigin="Anonymous"
                                    />
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className={styles.loggedInText}>
                                <div className={styles.chainName}>
                                    {"Polygon"}
                                </div>
                                <div className={styles.walletAddress}>
                                    { address? address.slice(0, 7) + '...' + address.slice(-6) : ''}
                                </div>
                            </div>
                            <CustomButton
                                type="login"
                                theme="dark"
                                icon="logout"
                                size={28}
                                className={styles.loginButton}
                                onClick={logOut}
                            />
                        </li>
                    </>
                )}
            </ul>

            <div
                className={classnames(
                    styles.userLoginMethodsModal,
                    open ? styles.opened : null
                )}
            >
                <div className={styles.title}>
                    <span>Log in</span>
                </div>
                <CustomButton
                    theme="light"
                    icon="metamask"
                    text="Metamask"
                    size={18}
                    className={styles.methodButton}
                    onClick={metaMaskLogin}
                />
                <CustomButton
                    theme="light"
                    icon="phantom"
                    text="Phantom"
                    size={18}
                    className={styles.methodButton}
                    onClick={metaMaskLogin}
                />
                <CustomButton
                    theme="light"
                    icon="close"
                    text="Cancel"
                    size={18}
                    onClick={() => setOpen(false)}
                    className={styles.methodButton}
                />
            </div>
        </div>
    );
};
