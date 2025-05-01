import { useState, useEffect } from 'react'
import { FullScreen, useFullScreenHandle } from "react-full-screen"
import { Scene } from './components/Scene'
import { Controls } from './components/Controls'
import { LoadingSpinner } from './components/LoadingSpinner'
import { useAllLocalStorage } from "./hooks/useLocalStorage"
import './styles/App.css'
import './styles/LoadingSpinner.css'

const App = () => {
  const handle = useFullScreenHandle()
  const lsItems = useAllLocalStorage()
  const [isLoading, setIsLoading] = useState(false)

  const SPINNER_DELAY = 600

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, SPINNER_DELAY)

    return () => clearTimeout(timer)
  }, [lsItems, handle?.active])

  const toggleFullScreen = () => {
    if (handle?.active) {
      handle.exit()
    } else { 
      handle.enter() 
    }
  }

  return (
    <>
      <FullScreen handle={handle}>
        <div className="app">
          {isLoading ? <LoadingSpinner /> : <Scene />}
          <Controls onFullScreen={toggleFullScreen} />  
        </div>
      </FullScreen>
    </>
  )
}

export default App
