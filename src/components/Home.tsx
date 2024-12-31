import React from "react";
import banner from "../image/banner.png"
import "./css/Home.css"

const Home:React.FC = () => {
  return (
    <div>
      <div className="banner">
        <img src={banner} alt="" />
      </div>
    </div>
  )
}

export default Home