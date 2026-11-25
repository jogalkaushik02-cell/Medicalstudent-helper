import { createContext, useContext } from 'react'

export const SearchOpenContext = createContext<() => void>(() => {})

export function useSearchOpen() {
  return useContext(SearchOpenContext)
}
