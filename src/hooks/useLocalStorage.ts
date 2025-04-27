import { useState, useEffect } from 'react'

/**
 * Options for the useLocalStorage hook
 */
export interface LocalStorageOptions {
  /**
   * Whether to reload the page after updating the value
   * @default false
   */
  reloadOnChange?: boolean;
  
  /**
   * Delay in milliseconds before reloading the page
   * @default 100
   */
  reloadDelay?: number;
}

/**
 * A generic hook for reading and writing values to localStorage
 * @param key The localStorage key to use
 * @param initialValue The initial value if no value exists in localStorage
 * @param options Additional options for the hook
 * @returns A stateful value and a function to update it
 */
export function useLocalStorage<T>(
  key: string, 
  initialValue: T, 
  options: LocalStorageOptions = {}
): [T, (value: T) => void] {
  const { reloadOnChange = false, reloadDelay = 100 } = options
  
  // Initialize state from localStorage or use the initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading from localStorage: ${error}`)
      return initialValue
    }
  })

  // Update localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.error(`Error writing to localStorage: ${error}`)
    }
  }, [key, storedValue])

  // Function to update the state and localStorage
  const setValue = (value: T) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      // Reload the page if requested
      if (reloadOnChange) {
        setTimeout(() => {
          window.location.reload()
        }, reloadDelay)
      }
    } catch (error) {
      console.error(`Error updating localStorage: ${error}`)
    }
  }

  return [storedValue, setValue]
}

/**
 * A hook for reading and writing boolean values to localStorage
 * @param key The localStorage key to use
 * @param initialValue The initial value if no value exists in localStorage
 * @param options Additional options for the hook
 * @returns A stateful boolean value and a function to update it
 */
export function useLocalStorageBoolean(
  key: string, 
  initialValue: boolean, 
  options: LocalStorageOptions = {}
): [boolean, (value: boolean) => void] {
  return useLocalStorage<boolean>(key, initialValue, options)
}

/**
 * A hook for reading and writing string values to localStorage
 * @param key The localStorage key to use
 * @param initialValue The initial value if no value exists in localStorage
 * @param options Additional options for the hook
 * @returns A stateful string value and a function to update it
 */
export function useLocalStorageString(
  key: string, 
  initialValue: string, 
  options: LocalStorageOptions = {}
): [string, (value: string) => void] {
  return useLocalStorage<string>(key, initialValue, options)
}

/**
 * A hook for reading and writing number values to localStorage
 * @param key The localStorage key to use
 * @param initialValue The initial value if no value exists in localStorage
 * @param options Additional options for the hook
 * @returns A stateful number value and a function to update it
 */
export function useLocalStorageNumber(
  key: string, 
  initialValue: number, 
  options: LocalStorageOptions = {}
): [number, (value: number) => void] {
  return useLocalStorage<number>(key, initialValue, options)
} 
