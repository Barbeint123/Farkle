import { useState } from "react"

export default function HigscoreSubmit(props) {

  const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false)

  async function addUser(formData) {
    const name = formData.get("username")

    const userData = {
      name,
      score: props.score,
    }

    try {
      const res = await fetch("http://localhost:5000/add_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      const data = await res.json()
      console.log("User added:", data)

      setHasBeenSubmitted(true)
      if (props.onSubmitSuccess) props.onSubmitSuccess()

    } catch (err) {
      console.error("Error submitting score:", err)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (hasBeenSubmitted) {
      alert("You have already submitted your score!")
      return
    } 
    const formData = new FormData(e.target)
    addUser(formData)
  }

  return (
    <>
      {hasBeenSubmitted ? null : <form onSubmit={handleSubmit}>
        <input id="u" type="text" name="username" placeholder="Enter your name" required minLength={3} maxLength={20}/>
        <button type="submit" className="submit-form-button">Submit</button>
      </form>}
    </>
  )
}
