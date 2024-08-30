type BaseServerEvent = {}
type BaseClientEvent = { roomID: string, userID: string }

export const namespace = "stone-paper-scissors" as const

// export const SERVER_EVENTS = 