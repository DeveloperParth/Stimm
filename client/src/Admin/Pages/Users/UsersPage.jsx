import React, { useState, useEffect } from "react";
import Users from "./Users";
import { getUsers } from "./../../../Services/Services";

function UsersPage() {
  const [users, setUsers] = useState(null);
  const fetchUsers = async () => {
    const { data } = await getUsers();
    setUsers(data.users);
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      {users && <Users data={users} setData={setUsers} />}
    </>
  );
}

export default UsersPage;