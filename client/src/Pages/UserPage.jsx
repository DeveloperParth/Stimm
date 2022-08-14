import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { followUser, getUser } from "./../Services/Services";

function UserPage() {
  const [user, setUser] = useState();
  const { username } = useParams();
  console.log(username);
  const fetchUser = async () => {
    try {
      const response = await getUser(username);
      setUser(response.data.user);
    } catch (error) {
      alert(error.message);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) return <>Loading...</>;
  return (
    <div>
      <button
        onClick={async () => {
          await followUser(user._id)
          console.log('followed');
        }}
      >
        Follow
      </button>
    </div>
  );
}

export default UserPage;
