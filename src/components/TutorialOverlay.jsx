import die1 from "./../images/die1.png"
import die2 from "./../images/die2.png"
import die3 from "./../images/die3.png"
import die4 from "./../images/die4.png"
import die5 from "./../images/die5.png"
import die6 from "./../images/die6.png"

export default function Tutorial(props) {
  const diceImages = [die1, die2, die3, die4, die5, die6]

  const oneAndFive = (
    <>
      <h2 className="centered-columns">1s and 5s</h2>
      <div className="centered-rows" style={{ justifyContent: "center", gap: "2vw", marginBottom: "25px" }}>
        <div className="centered-columns">
          <img className="tutorial-die" src={diceImages[0]} />
          <span className="combo-points">100</span>
        </div>
        <div className="centered-columns">
          <img className="tutorial-die" src={diceImages[4]} />
          <span className="combo-points">50</span>
        </div>
      </div>
    </>
  )

  function createDiceRows(arr, val, header) {
    const dice = arr.map((num, index) => (
      <img
        key={index}
        className="tutorial-die"
        src={diceImages[num - 1]}
        alt={`Die ${num}`}
      />
    ))

    return (
      <div className="centered-columns" style={{ marginBottom: "25px" }}>
        {header ? <h2 style={headerStyle}>{header}</h2> : null}
        <div className="centered-rows">{dice}</div>
        <span className="combo-points">{val}</span>
      </div>
    )
  }

  const headerStyle = {
    marginBottom: "10px",
  }

  return (
    <div className="overlay-container">

      <h1 className="centered-columns overlay-h1"> Basic Rules</h1>

      <div className="info-section" style={{padding: "20px 25px", boxShadow: "none"}}>
          <p style={{marginTop: "10px"}}>
            Each round starts with a roll of six dice. Pick the scoring dice you
            want to keep, then choose whether to <b>keep rolling</b> for a higher
            score or <b>bank</b> your points to secure them.
          </p>
          <p>
            If your roll has no scoring dice, you <b>Farkle</b>, losing all the
            points from that round. However, if you manage to keep with six
            scoring dice, you get a <b>hot dice</b> bonus and can roll all six
            again!
          </p>
          <p>
            There are 10 rounds in total, try to finish with the highest score
            possible.
          </p>
      </div>

      <h1 className="centered-columns overlay-h1"> Point Combinations</h1>

      <div className="grid-container">
        <span>
          <div className="info-section">{oneAndFive}</div>

          <div className="info-section">
            {createDiceRows([1, 1, 1], 1000, "Triples")}
            {createDiceRows([2, 2, 2], 200)}
            {createDiceRows([3, 3, 3], 300)}
            {createDiceRows([4, 4, 4], 400)}
          </div>
        </span>

        <span>
          <div className="info-section">
            {createDiceRows([1, 2, 3, 4, 5], 500, "Straights")}
            {createDiceRows([2, 3, 4, 5, 6], 750)}
            {createDiceRows([1, 2, 3, 4, 5, 6], 1000)}
          </div>

          <div className="info-section">
            <h2 style={headerStyle}>4+ of the same</h2>
            <span>each additional die after a triple doubles the value</span>
            {createDiceRows([2, 2, 2, 2, 2], "200 * 2 * 2 = 800")}
          </div>
        </span>
      </div>

      <button className="overlay-exit-button" onClick={props.function} aria-label="Exit tutorial overlay">
        X
      </button>

    </div>
  )
}
