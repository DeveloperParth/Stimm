import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  bookmarkPost,
  deletePost,
  getComments,
  getSinglePost,
  likePost,
  reportPost,
  sortDate,
} from "./../Services/Services";

import {
  Avatar,
  Image,
  Mark,
  Anchor,
  ActionIcon,
  Container,
  Divider,
  Text,
  Group,
  Menu,
} from "@mantine/core";
import {
  IconBookmark,
  IconBookmarkOff,
  IconDots,
  IconFlag,
  IconHeart,
  IconMessageCircle,
  IconShare,
  IconTrash,
} from "@tabler/icons";

import CreateComment from "./../Components/Comment/CreateComment";
import PostButton from "../Components/Post/PostButton";
import Header from "../Components/Navigations/Header";
import PostPlaceHolder from "./../Components/Post/PostPlaceHolder";
import { useSelector } from "react-redux";
import Comment from "../Components/Comment/Comment";
import { showNotification } from "@mantine/notifications";

function PostPage() {
  const ref = useRef(null);
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState(null);
  const [createCommentOpened, setCreateCommentOpened] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [isPostLiked, setIsPostLiked] = useState(post?.likeFlag);
  const fetchPost = async () => {
    try {
      const { data } = await getSinglePost(id);
      setPost(data.post);
    } catch (error) {}
  };
  const fetchComments = async () => {
    const { data } = await getComments(id);
    setComments(data.comments);
  };
  const likePostHandler = async (e) => {
    await likePost(post._id);
    post.likes = isPostLiked ? post.likes - 1 : post.likes + 1;
    setIsPostLiked(!isPostLiked);
  };
  const createCommentHandler = () => {
    setCreateCommentOpened(true);
  };
  const deletePostHandler = async () => {
    await deletePost(post._id);
  };
  const bookmarkPostHandler = async () => {
    await bookmarkPost(post._id);
  };
  const reportPostHandler = async () => {
    await reportPost(post._id);
    showNotification({ title: "Post has been reported" });
  };
  useEffect(() => {
    fetchPost();
    fetchComments();
    // eslint-disable-next-line
  }, []);
  const mappedComments =comments &&comments.map((comment, i) => {
      return (
        <Comment
          comment={{ ...comment, isOwner: comment.author._id === user._id }}
          index={i}
          key={comment._id}
          setComments={setComments}
        />
      );
    });
  const jumpToReleventDiv = (id) => {
    const releventDiv = document.getElementById(id);
    releventDiv?.scrollIntoView({ behavior: "smooth" });
  };
  window.location.href.includes(`#`) &&
    jumpToReleventDiv(window.location.href.match(/#\w+/g)[0].replace("#", ""));
  return (
    <>
      <CreateComment
        opened={createCommentOpened}
        setOpened={setCreateCommentOpened}
        post={post?._id}
        setComments={setComments}
      />
      <Container size="600px">
        <Header title={"Post"} showGoBackButton />
        {!post ? (
          <PostPlaceHolder />
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
                  <Group align="baseline" spacing="xs">
                    <h3 ref={ref}>
                      {post.author.name}
                      <Link to={`/u/${post.author.username}/posts`} ref={ref}>
                        <span className="post__headerSpecial" ref={ref}>
                          @{post.author.username}
                        </span>
                      </Link>
                    </h3>
                    &bull;
                    <Text color="dimmed" size="xs">
                      {sortDate(Date.parse(post.createdAt))}
                    </Text>
                  </Group>
                  <div style={{ float: "right" }}>
                    <Menu width={200}>
                      <Menu.Target>
                        <ActionIcon>
                          <IconDots />
                        </ActionIcon>
                      </Menu.Target>

                      <Menu.Dropdown>
                        {post.bookmarkFlag ? (
                          <Menu.Item
                            onClick={bookmarkPostHandler}
                            icon={<IconBookmarkOff size={20} />}
                          >
                            Remove Bookmark
                          </Menu.Item>
                        ) : (
                          <Menu.Item
                            onClick={bookmarkPostHandler}
                            icon={<IconBookmark size={20} />}
                          >
                            Bookmark
                          </Menu.Item>
                        )}

                        <Menu.Item
                          onClick={reportPostHandler}
                          icon={<IconFlag size={20} />}
                        >
                          Report post
                        </Menu.Item>
                        {post.isOwner ? (
                          <Menu.Item
                            icon={<IconTrash size={18} />}
                            color="red"
                            onClick={deletePostHandler}
                          >
                            Delete post
                          </Menu.Item>
                        ) : null}
                      </Menu.Dropdown>
                    </Menu>
                  </div>
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
                  icon={<IconShare size={20} />}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.hostname}:${window.location.port}/p/${post._id}`
                    );
                    return showNotification({ title: "Copied to clipboard" });
                  }}
                />
                <PostButton
                  color="pink"
                  icon={<IconHeart size={20} />}
                  text={post.likes}
                  active={isPostLiked}
                  onClick={likePostHandler}
                />
              </div>
            </div>
          </div>
        )}
        <Divider />
        <div className="comments">
          {comments ? mappedComments : <PostPlaceHolder />}
        </div>
      </Container>
    </>
  );
}
export default PostPage;
