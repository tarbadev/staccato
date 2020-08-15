import React, { useEffect, useState } from 'react'
import Bundle from "./Bundle";

function App() {
  const [bundles, setBundles] = useState([])

  useEffect(() => {
    fetch('/api')
      .then(response => response.json())
      .then(data => setBundles(data))
  }, [])

  const welcomeMessagesToDisplay = bundles.map((bundle: Bundle, index) =>
    <p key={`welcome-${index}`} data-bundle-name="">{bundle.name}</p>)
  return (
    <div id="home">
      {welcomeMessagesToDisplay}
    </div>
  )
}

export default App
