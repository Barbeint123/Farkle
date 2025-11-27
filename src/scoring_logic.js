const SCORE_MAP = {
  1: { 3: 1000, 4: 2000, 5: 4000, 6: 8000 },
  2: { 3: 200, 4: 400, 5: 800, 6: 1600 },
  3: { 3: 300, 4: 600, 5: 1200, 6: 2400 },
  4: { 3: 400, 4: 800, 5: 1600, 6: 3200 },
  5: { 3: 500, 4: 1000, 5: 2000, 6: 4000 },
  6: { 3: 600, 4: 1200, 5: 2400, 6: 4800 },
}

const SINGLE_SCORE = {
  1: 100,
  5: 50,
}

function create_dice_object(dice_array) {
  return dice_array.reduce((obj, die) => {
    const key = String(die)
    obj[key] = (obj[key] || 0) + 1
    return obj
  }, {})
}

function score_dice(dice_array) {
  let score = 0
  let counts = create_dice_object(dice_array)
  let remains = false

  // Check for straight
  const { straight_score, remaining_counts } = score_straights(counts)
  score += straight_score
  counts = remaining_counts

  // Regular scores
  for (const [val, amount] of Object.entries(counts)) {
    const nVal = Number(val)
    let remaining = amount

    // Score 3+ of a kind
  if (SCORE_MAP[nVal] && amount >= 3) {
    score += SCORE_MAP[nVal][amount]
    counts[val] -= amount
    remaining -= amount
  }

  // Score singles
  if (SINGLE_SCORE[nVal] && remaining > 0) {
    score += SINGLE_SCORE[nVal] * remaining
    counts[val] -= remaining
    remaining = 0
  }

  if (remaining > 0) {
    remains = true
  }
}

  return { score, remains, counts }
}

function score_straights(dice_object) {
  let score = 0
  const counts_copy = { ...dice_object }

  const dice_values = Object.keys(counts_copy).sort()
  const unique_values_string = dice_values.join("")

  const six_straight_pattern = "123456"
  const five_straight_1_pattern = "12345"
  const five_straight_2_pattern = "23456"

  // Check for 6-die straight
  if (unique_values_string.includes(six_straight_pattern)) {
    score = 1500

    // Remove one of each die from 1 to 6
    for (let i = 1; i <= 6; i++) {
      const key = String(i)
      if (counts_copy[key] > 0) {
        counts_copy[key] -= 1
      }
    }
  }
  // Check for 5-Die Straights
  else if (unique_values_string.includes(five_straight_2_pattern)) {
    score = 750

    // Remove one of each die from 2 to 6
    for (let i = 2; i <= 6; i++) {
      counts_copy[String(i)] -= 1
    }
  } else if (unique_values_string.includes(five_straight_1_pattern)) {
    score = 500

    // Remove one of each die from 1 to 5
    for (let i = 1; i <= 5; i++) {
      counts_copy[String(i)] -= 1
    }
  }
  return { straight_score: score, remaining_counts: counts_copy }
}

export default score_dice
