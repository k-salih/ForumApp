import User from "./User";

const Profile = ({ users }) => {
  const loggedInUser = JSON.parse(window.localStorage.getItem("forumappUser"));
  const user = users.find((user) => user.username === loggedInUser.username);

  if (!user) return null;

  return (
    <div>
      <User users={[user]} />
    </div>
  );
};

export default Profile;
