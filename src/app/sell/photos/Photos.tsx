import { User } from "next-auth";

interface Props {
  user: User;
}

export default function Photos({ user }: Props) {
  return <div>Photos</div>;
}
