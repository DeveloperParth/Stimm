import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Comments from "../Components/Comments";
import { getSinglePost, likePost, getComments } from "../Services/Services";
function Post() {
  const { id } = useParams();
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
  const [isPostLiked, setIsPostLiked] = useState(post?.likeFlag);
  const fetchPost = async () => {
    try {
      const response = await getSinglePost(id);
      setPost(response.data.post);
    } catch (error) {}
  };
  const fetchComments = async () => {
    try {
      const res = await getComments("62e522eb5f3a7c46986fb3e9");
      setComments(res.data.comments);
    } catch (error) {
      console.log(error);
    }
  };
  const likeHandler = async (e) => {
    await likePost(post._id);
    setIsPostLiked(!isPostLiked);
    post.likes = isPostLiked ? post.likes - 1 : post.likes + 1;
  };
  useEffect(() => {
    fetchPost();
    fetchComments(id);
  }, []);

  if (!post) return <>Loading....</>;
  return (
    <>
      <div className="post">
        <div className="author">
          <div className="image">
            <img src="https://i.pravatar.cc/40" alt="" />
          </div>
          <div className="userinfo">
            <span className="name">{post.author.name}</span>
            <span className="username">@{post.author.username}</span>
          </div>
        </div>
        <div className="body">{post.body}</div>
        <div className="interaction">
          <button onClick={likeHandler} className={isPostLiked ? "liked" : ""}>
            <i className="fa-regular fa-heart"></i>
            {post.likes}
          </button>
          <button>
            <i className="fa-solid fa-retweet"></i>
            {10}
          </button>
          <button>
            <i className="fa-regular fa-comment"></i>
            {post.comments}
          </button>
          <button>
            <i className="fa-solid fa-share-nodes"></i>
          </button>
        </div>
      </div>
      {comments.length && <Comments comments={comments} />}
    </>
  );
}
export default Post;
