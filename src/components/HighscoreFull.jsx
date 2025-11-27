
import {useState} from "react"
import HighscoreTable from "./HighscoreTable"
import Submit from "./HighscoreSubmit"

export default function HighscoreFull(props){
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    function handleHighscoreSubmit() {
    setRefreshTrigger(prev => prev + 1)
  }

    return (
        <>
            <HighscoreTable refreshTrigger={refreshTrigger}/>
            <Submit score={props.score} onSubmitSuccess={handleHighscoreSubmit}/>
        </>
    )
}