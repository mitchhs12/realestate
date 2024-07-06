import { User } from "next-auth";

interface Props {
  user: User;
}

export default function Title({ user }: Props) {
  return <div>Title</div>;
}
