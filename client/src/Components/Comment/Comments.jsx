import React from "react";
import Comment from "./Comment";

function Comments({ comments }) {
  if (typeof comments == "string") return comments;
  const mappedComments = nestComments(comments).map((comment) => {
    return <Comment comment={comment} key={comment._id} />;
  });
  return <div className="comments">{mappedComments}</div>;
}
function nestComments(commentList) {
  const commentMap = {};
  commentList.forEach((comment) => (commentMap[comment._id] = comment));
  commentList.forEach((comment) => {
    if (comment.parent !== null) {
      const parent = commentMap[comment.parent];
      (parent.comments = parent.comments || []).push(comment);
    }
  });
  return commentList.filter((comment) => {
    return comment.parent === null;
  });
}
export default Comments;
