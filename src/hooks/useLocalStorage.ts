import { useState, useEffect, useRef } from 'react'
import { LOCAL_STORAGE_PREFIX } from '../constants/controls'

// Custom event name for localStorage changes
const LOCAL_STORAGE_CHANGE_EVENT = 'localStorageChange'

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
 * Type for the values that can be stored in localStorage
 */
type StorageValue = string | number | boolean | object | null;

// Helper function to notify about localStorage changes
const notifyStorageChange = (key: string) => {
  window.dispatchEvent(new CustomEvent(LOCAL_STORAGE_CHANGE_EVENT, { detail: { key } }))
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
  const LOCAL_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}_${key}`
  const previousValueRef = useRef<string | null>(null)
  
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(LOCAL_STORAGE_KEY)
      previousValueRef.current = item
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading from localStorage: ${error}`)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      const newValue = JSON.stringify(storedValue)
      // Only update and notify if the value actually changed
      if (newValue !== previousValueRef.current) {
        localStorage.setItem(LOCAL_STORAGE_KEY, newValue)
        previousValueRef.current = newValue
        notifyStorageChange(LOCAL_STORAGE_KEY)
      }
    } catch (error) {
      console.error(`Error writing to localStorage: ${error}`)
    }
  }, [LOCAL_STORAGE_KEY, storedValue])

  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
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

/**
 * A hook that reads all localStorage items with a given prefix
 * @param prefix The prefix to filter localStorage items (defaults to LOCAL_STORAGE_PREFIX)
 * @returns An object containing all matching localStorage items
 */
export function useAllLocalStorage(prefix: string = LOCAL_STORAGE_PREFIX) {
  const [allValues, setAllValues] = useState<Record<string, StorageValue>>({})
  const valuesRef = useRef<Record<string, StorageValue>>({})

  useEffect(() => {
    const loadAllValues = () => {
      const values: Record<string, StorageValue> = {}
      let hasChanges = false
      
      for (let i = 0; i < localStorage.length; i++) {
        const fullKey = localStorage.key(i)
        if (fullKey && fullKey.startsWith(prefix)) {
          try {
            const key = fullKey.slice(prefix.length + 1)
            const value = localStorage.getItem(fullKey)
            const parsedValue = value ? JSON.parse(value) : null
            values[key] = parsedValue
            
            // Check if this value is different from our previous value
            if (JSON.stringify(valuesRef.current[key]) !== JSON.stringify(parsedValue)) {
              hasChanges = true
            }
          } catch (error) {
            console.error(`Error parsing localStorage item: ${error}`)
          }
        }
      }
      
      // Only update state if there are actual changes
      if (hasChanges || Object.keys(values).length !== Object.keys(valuesRef.current).length) {
        valuesRef.current = values
        setAllValues(values)
      }
    }

    // Load initial values
    loadAllValues()

    // Add event listeners for both storage and custom change events
    const handleStorageChange = (event: StorageEvent) => {
      if (!event.key || event.key.startsWith(prefix)) {
        loadAllValues()
      }
    }

    const handleLocalChange = (event: CustomEvent) => {
      if (event.detail?.key?.startsWith(prefix)) {
        loadAllValues()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleLocalChange as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleLocalChange as EventListener)
    }
  }, [prefix])

  return allValues
} 
