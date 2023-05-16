import { useState, useEffect } from 'react'

const INTERVAL = 80
const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

function Loading({ text = 'Loading', loading = true }) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (loading) {
      const timer = setInterval(() => {
        setFrame((frame) => (frame + 1) % FRAMES.length)
      }, INTERVAL)
      return () => clearInterval(timer)
    }
  }, [loading])

  return (
    <div className="loading">
      {text} <span>{FRAMES[frame]}</span>
    </div>
  )
}

export default Loading
