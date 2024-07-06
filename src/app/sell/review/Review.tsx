import { User } from "next-auth";

interface Props {
  user: User;
}

export default function Review({ user }: Props) {
  return <div>Review</div>;
}
