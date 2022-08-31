import { Container } from "@mantine/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Comments from "../Components/Comment/Comments";
import { getSinglePost, likePost, getComments } from "./../Services/Services";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { removePost, setPostLike } from "../Redux/Features/feedSlice";

import CreateComment from "./../Components/Comment/CreateComment";

import { Avatar, Image, Box, Mark, Anchor, ActionIcon } from "@mantine/core";
import {
  IconHeart,
  IconMessageCircle,
  IconRepeat,
  IconTrash,
} from "@tabler/icons";
import { useRef } from "react";

function Post() {
  const ref = useRef(null);
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
    // eslint-disable-next-line
  }, []);

  if (!post) return <>Loading....</>;
  return (
    <>
      <Container size="600px" m={0} className="feed">
        <div className="post" style={{width: "600px"}}>
          <div className="post__avatar">
            <Avatar
              src={"http://localhost:5000/uploads/" + post.author.avatar}
              radius="xl"
            />
          </div>
          <div className="post__body">
            <div className="post__header">
              <div className="post__headerText">
                <h3 ref={ref}>
                  {post.author.name}
                  <Link to={`/u/${post.author.username}/posts`} ref={ref}>
                    <span className="post__headerSpecial" ref={ref}>
                      @{post.author.username}
                    </span>
                  </Link>
                </h3>
                {post.isOwner ? (
                  <ActionIcon
                    style={{ float: "right" }}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                ) : null}
              </div>
              <div className="post__headerDescription">
                <p>
                  {post.body.split(" ").map((w) => {
                    // console.log(w);
                    if (w.startsWith("#")) {
                      return (
                        <Link to={`/explore/`} key={w}>
                          <Mark> {w} </Mark>
                        </Link>
                      );
                    }
                    if (w.startsWith("@")) {
                      w = w.replace("@", "");
                      return (
                        <Anchor key={w} component={Link} to={`/u/${w}/posts`}>
                          {w}
                        </Anchor>
                      );
                    }
                    return <> {w} </>;
                  })}
                </p>
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
              <button>
                <IconMessageCircle size={20} />
                <span>{post.comments}</span>
              </button>
              <button>
                <IconRepeat size={20} />
                <span>{post.comments}</span>
              </button>

              <button
                className={post.likeFlag ? "liked" : ""}
              >
                <IconHeart size={20} />
                <span>{post.likes}</span>
              </button>
            </div>
          </div>
        </div>
        {comments.length && <Comments comments={comments} />}
      </Container>
    </>
  );
}
export default Post;
