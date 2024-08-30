
import { TIERS} from "common"

type Props = {
  onJoin: (tier:TIERS)=> void
}
export default function MainMenu({onJoin }: Props) {
  return (
    <main>
      <button onClick={()=>onJoin(TIERS.ALPHA)}>Alpha ($1)</button>
      <button onClick={()=>onJoin(TIERS.BETA)}>Beta ($3)</button>
      <button onClick={()=>onJoin(TIERS.GAAMA)}>Gaama ($10)</button>
    </main>
  )
}
