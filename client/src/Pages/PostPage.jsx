import { Center, Container, Loader } from "@mantine/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Comments from "../Components/Comment/Comments";
import { getSinglePost, likePost, getComments } from "./../Services/Services";

import { Link } from "react-router-dom";

import CreateComment from "./../Components/Comment/CreateComment";

import { Avatar, Image, Mark, Anchor, ActionIcon } from "@mantine/core";
import {
  IconHeart,
  IconMessageCircle,
  IconRepeat,
  IconTrash,
} from "@tabler/icons";
import { useRef } from "react";
import PostButton from "../Components/Post/PostButton";
import Header from "../Components/Navigations/Header";

function PostPage() {
  const ref = useRef(null);
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [createCommentOpened, setCreateCommentOpened] = useState(false);
  const [isPostLiked, setIsPostLiked] = useState(post?.likeFlag);
  const fetchPost = async () => {
    try {
      const { data } = await getSinglePost(id);
      setPost(data.post);
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
  const likePostHandler = async (e) => {
    await likePost(post._id);
    setIsPostLiked(!isPostLiked);
    post.likes = isPostLiked ? post.likes - 1 : post.likes + 1;
  };
  const createCommentHandler = () => {};
  useEffect(() => {
    fetchPost();
    fetchComments(id);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <CreateComment
        opened={createCommentOpened}
        setOpened={setCreateCommentOpened}
      />
      <Container size="600px">
        <Header title={"post"} showGoBackButton />
        {!post ? (
          <Center>
            <Loader />
          </Center>
        ) : (
          <div className="post">
            <div className="post__avatar">
              <Avatar
                src={process.env.REACT_APP_UPLOADS_PATH + post.author.avatar}
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
                    <ActionIcon style={{ float: "right" }}>
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
                <PostButton
                  color="blue"
                  icon={<IconMessageCircle size={20} />}
                  text={post.comments}
                  onClick={createCommentHandler}
                />

                <PostButton
                  color="green"
                  icon={<IconRepeat size={20} />}
                  text="20"
                />
                <PostButton
                  color="pink"
                  icon={<IconHeart size={20} />}
                  text={post.likes}
                  active={post.likeFlag}
                  onClick={likePostHandler}
                />
              </div>
            </div>
          </div>
        )}
        {comments.length && <Comments comments={comments} />}
      </Container>
    </>
  );
}
export default PostPage;
