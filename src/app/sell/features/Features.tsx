import { User } from "next-auth";

interface Props {
  user: User;
}

export default function Features({ user }: Props) {
  return <div>Features</div>;
}
