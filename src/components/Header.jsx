import Button from "./Button"
import Podium from "../images/podium.svg"
import Questionmark from "../images/questionmark.svg"

import {useState} from "react"


export default function Header(props) {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  const headerStyle = {
    width: "100%",
    justifyContent: "space-around",
    marginTop: "5px",
  }

  return (
    <>
      <div className="centered-rows" style={headerStyle}>

        <Button function={props.functionLeft} image={Podium} textClass="leaderboard-text" ariaLabel="open leaderboard"/>

        <div className={`centered-columns ${props.isBust ? "red-text" : null}`} >
            {props.isBust ? <span className="farkle-pre-title glow-animation">YOU'VE </span> : <span></span>}
            {props.isBust ? <h1 className="farkle-title glow-animation">FARKLE'D</h1> : <h1 className="farkle-title">FARKLE</h1>}
        </div>

        <Button function={props.functionRight} image={Questionmark} textClass="tutorial-text" ariaLabel="open tutorial"/>

      </div>
    </>
  )
}
