export default function Button(props) {

    const containsImage = props.image != null
    const buttonClass = props.class != null ? props.class : "button-default"

  return (
    <div className="centered-columns">
      <button className={buttonClass} style={props.buttonStyling} title={props.title} onClick={props.function} aria-label={props.ariaLabel}>
        {containsImage ? <img src={props.image} alt={props.alt}></img> : <div>{props.text}</div>}
      </button>
      <div className="under-button-text">
        <span className={props.textClass}>{containsImage ? props.text : null}</span>
      </div>
    </div>
  )
}
