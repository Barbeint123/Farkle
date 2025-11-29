import { useEffect, useState } from "react"

export default function HighscoreTable(props) {
    
  const [highscores, setHighscores] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchHighscores() {
      setIsLoading(true)
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/get_highscores`)
        const data = await res.json()
        setHighscores(data)
      } catch (err) {
        console.error("Error fetching highscores:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHighscores()
  }, [props.refreshTrigger])

  return (
    <>
      {!isLoading ? <table>
        <caption className="visually-hidden">Highscore leaderboard</caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Score</th>
          </tr>
        </thead>

        <tbody>
          {highscores.map((el, index) => (
            <tr key={el._id}>
              <td>{index + 1}</td>
              <td>{el.name}</td>
              <td>{el.score}</td>
            </tr>
          ))}
        </tbody>
      </table> : <p>Loading highscores...</p>}
    </>
  )
}
