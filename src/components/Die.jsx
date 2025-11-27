export default function Die(props) {
 const className = [
    "die",
    props.isLocked && "die--locked",
    props.isHeld && "die--hold",
    props.shouldBlink && "die--blink",
    props.rolling && "roll-animation",  
  ]
    .filter(Boolean)
    .join(" ")

  const dotPatterns = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9],
  }

  const dots = dotPatterns[props.value].map((pos) => (
    <span
      key={pos}
      className={`dot pos${pos} ${props.isLocked ? "dot--locked" : ""}`}
    ></span>
  ))

  return (
    <button className="die-button" onClick={props.onToggle} aria-label="toggle die hold">
      <div className={className}>
        <div className="die-face" alt={`die showing ${props.value}`}>{dots}</div>
      </div>
    </button>
  )
}
