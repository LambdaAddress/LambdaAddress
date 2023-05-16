function getAddressDifficulty(str) {
  str = str.toLowerCase()
  let count = 1
  let maxCount = 1
  for (let i = 0; i < str.length - 1; i++) {
    if (str[i] === str[i + 1]) {
      count++
    } else {
      maxCount = Math.max(maxCount, count)
      count = 1
    }
  }
  return Math.max(maxCount, count)
}

export default getAddressDifficulty
