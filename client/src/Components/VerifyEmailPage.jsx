import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setUser } from "../Redux/Features/authSlice";
import { verifyUser } from "../Services/Services";

function VerifyEmailPage() {
  const dispatch = useDispatch();
  const { token, id } = useParams();
  useEffect(() => {
    id &&
      token &&
      (async () => {
        try {
          const { data } = await verifyUser(id, token);
          dispatch(setUser({ user: data.user }));
        } catch (error) {
          alert("Something went wrong");
        }
      })();
    // eslint-disable-next-line
  }, []);

  return <div>VerifyEmailPage</div>;
}

export default VerifyEmailPage;
