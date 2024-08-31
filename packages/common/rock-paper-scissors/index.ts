type BaseServerEvent = { type: string };
type BaseClientEvent = { type: string; roomID: string; userID: string };

export class RockPaperScissors {
  public static gameId = "ef392e1a-673c-4f6c-a259-20cff47d1dd9" as const;

  public static SERVER_EVENTS: BaseServerEvent[] = [];
  public static CLIENT_EVENTS: BaseClientEvent[] = [];
}
