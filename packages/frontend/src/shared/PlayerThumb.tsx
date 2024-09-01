type Props = {
  user_id: string;
};
export default function PlayerThumb({ user_id }: Props) {
  return <article>{user_id}</article>;
}
