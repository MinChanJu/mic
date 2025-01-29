import React from "react"
import banner from "../assets/images/banner.png"

const Home: React.FC = () => {
  return (
    <div className="banner">
      <img src={banner} alt="배너" />
    </div>
  )
}

export default Home