import React, {useEffect, useState} from 'react'

function App() {
    const [welcomeMessage, setWelcomeMessage] = useState('')

    useEffect(() => {
        fetch('/api')
            .then(response => response.text())
            .then(data => setWelcomeMessage(data))
    }, [])

    return (
        <div className="App">
            <p>
                {welcomeMessage}
            </p>
        </div>
    )
}

export default App
