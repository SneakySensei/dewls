type Props = {
  player_id: string;
};
export default function PlayerThumb({ player_id }: Props) {
  return <article>{player_id}</article>;
}
