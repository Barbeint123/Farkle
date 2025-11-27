import HighscoreList from "./HighscoreTable"

export default function HighscoreOverlay(props) {
  return (
    <div className="overlay-container">
      <div className="centered-columns">
        <h1 style={{letterSpacing: "0.05em", marginBottom: "2rem"}}>HIGHSCORES</h1>
        <HighscoreList />
      </div>

      <button className="overlay-exit-button" onClick={props.function} aria-label="Exit leaderboard overlay">
        X
      </button>
    </div>
  )
}
