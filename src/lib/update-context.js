import { createContext, useContext } from 'react'

export const UpdateContext = createContext(null)

const fallback = {
  state: 'idle',
  info: null,
  version: '0.0.0',
  check: async () => null,
  dismiss: () => {},
  applyUpdate: () => false,
}

/** Доступ к проверке обновлений: состояние, ручная проверка, установка */
export function useUpdate() {
  return useContext(UpdateContext) ?? fallback
}
