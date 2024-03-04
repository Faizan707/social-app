import React from 'react'
import styles from "./Home.module.css"
import { Link } from 'react-router-dom'
function Home() {
  return (
    <>
    <div className={styles.logostyle}>
        <h1 >FriendsBook</h1>
        
    </div>


    <div className={styles.container}>
      <h1>Welcome to FriendsBook  Here you can connect with friends.</h1>
      <div className={styles.linkcontainer}>
        <Link to="/login">Sign in</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>

      </>
  )
}

export default Home
