
import { useEffect, useState } from 'react'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import outputs from '../amplify_outputs.json'

Amplify.configure(outputs)

const client = generateClient()

function App() {
  const [message, setMessage] = useState('Loading...')
  const [profiles, setProfiles] = useState([])
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    fetch('https://qnan3nwe54gurfmnhtpyfcb3te0avdnq.lambda-url.us-east-2.on.aws/')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage('Error connecting to Lambda'))

    client.models.Profile.list()
      .then(({ data }) => setProfiles(data))
      .catch(error => console.error('Error loading profiles:', error))
  }, [])

  async function addProfile(event) {
    event.preventDefault()

    if (!name.trim()) return

    try {
      const { data, errors } = await client.models.Profile.create({
        name: name.trim(),
        bio: bio.trim(),
      })

      if (errors?.length) {
        console.error('Error saving profile:', errors)
        return
      }

      if (data) {
        setProfiles(current => [...current, data])
        setName('')
        setBio('')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    }
  }

  return (
    <main>
      <h1>Profiles App</h1>
      <p>Created by Celia Gonzalez</p>
      <p>{message}</p>

      <h2>Profiles</h2>
      <form onSubmit={addProfile}>
        <div>
          <label htmlFor="profile-name">Name:</label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="profile-bio">Bio:</label>
          <input
            id="profile-bio"
            type="text"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
          />
        </div>

        <button type="submit">Save Profile</button>
      </form>

      {profiles.length === 0 ? (
        <p>No profiles found yet.</p>
      ) : (
        <ul>
          {profiles.map(profile => (
            <li key={profile.id}>
              <strong>{profile.name}</strong>
              {profile.bio && <p>{profile.bio}</p>}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
