import React from "react";

function Comment({ comment }) {
  return (
    <div className="comment">
      <span>{comment.body}</span>
      <div className="replies" style={{ marginLeft: "1rem" }}>
        {comment.comments &&
          comment.comments.map((c) => <Comment comment={c} key={c._id} />)}
      </div>
    </div>
  );
}
export default Comment;
