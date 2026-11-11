
import { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    fetch('https://qnan3nwe54gurfmnhtpyfcb3te0avdnq.lambda-url.us-east-2.on.aws/')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage('Error connecting to Lambda'))
  }, [])

  return (
    <main>
      <h1>Profiles App</h1>
      <p>Created by Celia Gonzalez</p>
      <p>{message}</p>
    </main>
  )
}

export default App
