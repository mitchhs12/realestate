import { User } from "next-auth";

interface Props {
  user: User;
  typesObject: { id: string; name: string; translation: string }[];
}

export default function List({ user, typesObject }: Props) {
  return (
    <div>
      <h1>List</h1>
    </div>
  );
}
