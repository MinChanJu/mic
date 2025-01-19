import React from "react"
import banner from "../assets/banner.png"
import "../styles/Home.css"

const Home:React.FC = () => {
  return (
    <div>
      <div className="banner">
        <img src={banner} alt="배너" />
      </div>
    </div>
  )
}

export default Home