import "./App.css"
import Die from "./components/Die"
import Button from "./components/Button"

import Header from "./components/Header"
import TutorialOverlay from "./components/TutorialOverlay"
import HighscoreOverlay from "./components/HighscoreOverlay"
import SubmitHighscore from "./components/HighscoreFull"

import score_dice from "./scoring_logic"

import { useState } from "react"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

export default function App() {
  const [dice, setDice] = useState(() => generateAllNewScoreableDice())
  const [totalScore, setTotalScore] = useState(0)
  const [tempScore, setTempScore] = useState(0)
  const [roundNumber, setRoundNumber] = useState(1)
  const [showInfo, setShowInfo] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)


  const TOTALROUNDS = 10
  const completedAllRounds = roundNumber >= TOTALROUNDS + 1

  const unlockedDice = dice.filter((die) => !die.isLocked)

  const isHotDice = unlockedDice.length === 0

  const isBust =
    unlockedDice.length > 0 &&
    score_dice(unlockedDice.map((die) => die.value)).score === 0

  
  function roll() {
    // get the score and remains (nonscoring dice) of the held dice
    const {
      score: held_score,
      remains: has_remains,
      counts: nonscoring_dice,
    } = getScore()

    // You can only roll if you hold dice, and all the held dice score points
    // If rolled, update temporary score
    if (held_score > 0 && !has_remains) {
      setTempScore(prevScore => prevScore + held_score)

      // reroll unheld dice
      const animationKey = nanoid()
      setDice((prevDice) =>
        prevDice.map((die) => {
          if (!die.isHeld) {
            return {
              ...die,
              value: Math.ceil(Math.random() * 6),
              rolling: true, 
            }
          }
          return { ...die, isLocked: true }
        })
      )
      // turn off animation prop
      setTimeout(() => {
        setDice(prev =>
          prev.map(die =>
          die.rolling ? { ...die, rolling: false } : die 
          )
        )
      }, 160) //TODO match with animation length
    }

    // if dice are held which dont contribute to score, highlight them, and do not perform the roll
    else if (has_remains) {
      findAndBlinkDice(nonscoring_dice)
    }
  }


  function bank() {
    // get the score and remains of the held dice
    const { score: held_score, remains: has_remains, counts: nonscoring_dice } = getScore()

    // find all held dice
    let dice_held = []
    dice.map((die) => {
      if (die.isHeld && !die.isLocked) {
        dice_held.push(die.value)
      }
    })

    // If not busted, and held dice is eligible to score OR no dice are held, then
    // update totalScore, reset tempScore, iterate round, and reroll all dice
    if (!isBust && ((held_score > 0 && !has_remains) || dice_held.length === 0)) {
      setTotalScore((prevScore) => prevScore + tempScore + getScore().score)
      setTempScore(0)
      setRoundNumber((prevRound) => prevRound + 1)
      setDice(generateAllNewScoreableDice)
    }

    // if dice are held which dont contribute to score, highlight them, and do not perform the bank
    else if (has_remains) {
      findAndBlinkDice(nonscoring_dice)
    }
  }

  function findAndBlinkDice(nonscoring_dice) {
    // find all nonscoring dice pips
    const unscoreable_values = Object.keys(nonscoring_dice)
    .filter((val) => nonscoring_dice[val] > 0)

    // identify the ids of said dice
    const idsToBlink = dice
      .filter((die) => die.isHeld && !die.isLocked)
      .filter((die) => unscoreable_values.includes(String(die.value)))
      .map((die) => die.id)

    // activate blink for the nonscoring dice
    blinkDice(idsToBlink)
  }

  function blinkDice(ids) {
    setDice((old) =>
      old.map((die) =>
        ids.includes(die.id) ? { ...die, shouldBlink: true } : die
      )
    )

    setTimeout(() => {
      setDice((old) =>
        old.map((die) =>
          ids.includes(die.id) ? { ...die, shouldBlink: false } : die
        )
      )
    }, 800)
  }

  function toggleDieHold(id) {
    // Toggle die hold (only with non-locked die)
    setDice((oldDie) =>
      oldDie.map((die) => {
        if (die.id === id && !die.isLocked) {
          return {
            ...die,
            isHeld: !die.isHeld,
          }
        }
        return die
      })
    )
  }

  function getScore() {
    // get the score of all held (non-locked) dice
    let dice_held = []

    dice.map((die) => {
      if (die.isHeld && !die.isLocked) {
        dice_held.push(die.value)
      }
    })
    return score_dice(dice_held)
  }

  function generateAllNewDice() {
    return new Array(6).fill(0).map((_) => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      isLocked: false,
      shouldBlink: false,
      rolling: false,
      id: nanoid(),
    }))
  }

  function generateAllNewScoreableDice() {
    let startingDice = generateAllNewDice()
    while (score_dice(startingDice.map((die) => die.value)).score === 0) {
      startingDice = generateAllNewDice()
    }
    return startingDice
  }

  function startHotDiceRound() {
    setDice(generateAllNewDice)
  }

  function tryAgain() {
    setTempScore(0)
    setRoundNumber((prevRound) => prevRound + 1)
    setDice(generateAllNewScoreableDice)
  }

  function startAllOver() {
    setDice(generateAllNewDice)
    setTotalScore(0)
    setTempScore(0)
    setRoundNumber(0)
  }

  const diceUI = dice.map((die) => (
    <Die
      value={die.value}
      isHeld={die.isHeld}
      isLocked={die.isLocked}
      shouldBlink={die.shouldBlink}
      onToggle={() => toggleDieHold(die.id)}
      key={die.id}
      rolling={die.rolling}
    />
  ))

  function openInfo() {
    setShowInfo(true)
  }

  function closeInfo() {
    setShowInfo(false)
  }

  function openLeaderboard() {
    setShowLeaderboard(true)
  }

  function closeLeaderboard() {
    setShowLeaderboard(false)
  }

  return (
    <main>
      {showInfo ? <TutorialOverlay function={closeInfo} /> : null}
      {showLeaderboard ? (
        <HighscoreOverlay function={closeLeaderboard} />
      ) : null}

      <Header
        functionRight={openInfo}
        functionLeft={openLeaderboard}
        isBust={isBust}
      />

      <div className="main-content">
        {!completedAllRounds ? (
          <div>
            Round {roundNumber} / {TOTALROUNDS}
          </div>
        ) : null}
        <div className="score">{totalScore} </div>
        <div className="temp-score">
          {tempScore || getScore().score
            ? " + " + (tempScore + getScore().score)
            : ""}
        </div>

        {completedAllRounds ? <SubmitHighscore score={totalScore} /> : null}

        {isHotDice ? <h1 className="pop-animation">HOT DICE! 🔥👌</h1> : null}
        {!completedAllRounds ? (
          <div className="dice-container">{diceUI}</div>
        ) : null}

        <span className="centered-rows" style={{ gap: "3em" }}>
          {!isBust && !isHotDice && !completedAllRounds ? (
            <Button class="standard-button" text="Roll" function={roll} />
          ) : null}
          {!isBust && !isHotDice && !completedAllRounds ? (
            <Button class="standard-button" text="Bank" function={bank} />
          ) : null}
          {isBust ? (
            <Button
              class="standard-button farkle"
              text="New Round"
              function={tryAgain}
            />
          ) : null}
          {isHotDice ? (
            <Button
              class="standard-button"
              text="Roll & Continue"
              function={startHotDiceRound}
            />
          ) : null}
          {completedAllRounds ? (
            <Button
              class="standard-button"
              text="Try again"
              function={startAllOver}
            />
          ) : null}
        </span>
      </div>
      <div className="footer"></div>
    </main>
  )
}
