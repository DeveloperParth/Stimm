import React, { useState, useEffect } from "react";

import Comments from "../Comment/Comments";
import PostPlaceHolder from "./PostPlaceHolder";

import { useNavigate, useParams, Link } from "react-router-dom";
import { Image, Avatar, Modal, Loader } from "@mantine/core";
import { IconHeart, IconMessageCircle, IconRepeat } from "@tabler/icons";

import { getSinglePost, likePost, getComments } from "../../Services/Services";

function PostModal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [isPostLiked, setIsPostLiked] = useState(post?.likeFlag);
  const fetchPost = async () => {
    try {
      const response = await getSinglePost(id);
      setPost(response.data.post);
      console.log(response);
    } catch (error) {
      alert(error);
    }
  };
  const fetchComments = async (id) => {
    try {
      const res = await getComments(id);
      setIsCommentsLoading(false);
      setComments(res.data.comments.length ? res.data.comments : "No comments");
    } catch (error) {
      console.log(error);
    }
  };
  const likePostHandler = async (e) => {
    await likePost(post._id);
    setIsPostLiked(!isPostLiked);
    post.likes = isPostLiked ? post.likes - 1 : post.likes + 1;
  };
  const deletePostHandler = async () => {
    // await deletePost(post._id);
    // dispatch(removePost({ index }));
  };
  const createCommentHandler = () => {
    // setCreateCommentOpened(true);
  };
  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    post && fetchComments(post._id);
  }, [post]);
  console.log(post);
  return (
    <>
      <Modal opened={true} onClose={() => navigate(-1)} size="lg">
        <div className="post-modal">
          {post ? (
            <>
              <div className="post">
                <div className="post__avatar">
                  <Avatar
                    src={"http://localhost:5000/uploads/" + post.author.avatar}
                    radius="xl"
                  />
                </div>
                <div className="post__body">
                  <div className="post__header">
                    <div className="post__headerText">
                      <h3>
                        {post.author.name}
                        <Link to={`/u/${post.author.username}/posts`}>
                          <span className="post__headerSpecial">
                            @{post.author.username}
                          </span>
                        </Link>
                      </h3>
                      {post.isOwner ? (
                        <button
                          style={{ float: "right" }}
                          onClick={deletePostHandler}
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                    <div className="post__headerDescription">
                      <p>{post.body}</p>
                    </div>
                    {post.attachments?.length ? (
                      <div className="attachments">
                        {post.attachments.map((a) => (
                          <Image
                            src={"http://localhost:5000/" + a.path}
                            radius="md"
                            withPlaceholder
                            key={a}
                          />
                        ))}
                      </div>
                    ) : null}
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
              {isCommentsLoading ? (
                <Loader style={{ display: "block", margin: "auto" }} />
              ) : (
                <Comments comments={comments} />
              )}
            </>
          ) : (
            <PostPlaceHolder />
          )}
        </div>
      </Modal>
    </>
  );
}
export default PostModal;
