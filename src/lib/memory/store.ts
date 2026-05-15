// In-memory session store
const sessionStore = new Map<string, { role: string; content: string }[]>()

export function getHistory(sessionId: string) {
  return sessionStore.get(sessionId) || []
}

export function addMessage(sessionId: string, role: string, content: string) {
  const history = sessionStore.get(sessionId) || []
  history.push({ role, content })
  sessionStore.set(sessionId, history)
}

export function clearSession(sessionId: string) {
  sessionStore.delete(sessionId)
}

export { sessionStore }
