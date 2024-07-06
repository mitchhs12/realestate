import { User } from "next-auth";

interface Props {
  user: User;
}

export default function Contact({ user }: Props) {
  return <div>Contact</div>;
}
