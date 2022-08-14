import React from "react";
import { useDispatch } from "react-redux";
import { removePost, setPostLike } from "../Redux/Features/feedSlice";
import { deletePost, likePost } from "../Services/Services";
import { Link, useNavigate } from "react-router-dom";
import { IconHeart, IconMessageCircle, IconRepeat } from "@tabler/icons";
import CreateComment from "./CreateComment";
import { useState } from "react";
import { Avatar, Image } from "@mantine/core";

function Post({ post, index }) {
  console.log(post.author.avatar);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createCommentOpened, setCreateCommentOpened] = useState(false);
  const likePostHandler = async () => {
    const likeFlag = !post.likeFlag;
    const likes = post.likeFlag ? post.likes - 1 : post.likes + 1;
    await likePost(post._id);
    dispatch(setPostLike({ index, post: { ...post, likeFlag, likes } }));
  };
  const deletePostHandler = async () => {
    await deletePost(post._id);
    dispatch(removePost({ index }));
  };
  const createCommentHandler = () => {
    setCreateCommentOpened(true);
  };
  const postClickHandler = (e) => {
    if (e.target.tagName === "DIV") {
      navigate(`/p/${post._id}`);
    }
  };
  return (
    <>
      <CreateComment
        post={post}
        opened={createCommentOpened}
        setOpened={setCreateCommentOpened}
      />
      <div className="post" onClick={postClickHandler}>
        <div className="post__avatar">
          <Avatar src={"http://localhost:5000/uploads/"+post.author.avatar} radius="lg"/>
        </div>
        <div className="post__body">
          <div className="post__header">
            <div className="post__headerText">
              <h3>
                {post.author.name}
                <Link to={"/u/" + post.author.username}>
                  <span className="post__headerSpecial">
                    @{post.author.username}
                  </span>
                </Link>
                {post.isOwner ? (
                  <button
                    style={{ float: "right" }}
                    onClick={deletePostHandler}
                  >
                    Delete
                  </button>
                ) : null}
              </h3>
            </div>
            <div className="post__headerDescription">
              <p>{post.body}</p>
            </div>
            <div className="attachments">
              {post.attachments?.length&&post.attachments.map(a=><Image src={'http://localhost:5000/'+ a.path} radius="md" withPlaceholder/>)}
            </div>
          </div>
          <div className="post__footer">
            <button onClick={createCommentHandler}>
              <IconMessageCircle size={20} />
              <span>{post.comments}</span>
            </button>
            <button>
              <IconRepeat size={20} />
              <span>{post.comments}</span>
            </button>

            <button
              className={post.likeFlag ? "liked" : ""}
              onClick={likePostHandler}
            >
              <IconHeart size={20} />
              <span>{post.likes}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Post;
