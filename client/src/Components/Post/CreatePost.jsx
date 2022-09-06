import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addOwnPost } from "../../Redux/Features/feedSlice";
import {
  Button,
  Container,
  FileButton,
  Group,
  ThemeIcon,
  Tooltip,
  Textarea,
  Image,
  Indicator,
} from "@mantine/core";
import { IconPhoto, IconX } from "@tabler/icons";
import Header from "../Navigations/Header";
import { createPost } from "../../Services/Services";
import { showNotification } from "@mantine/notifications";

function CreatePost() {
  const [postBody, setPostBody] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const createPostHandler = async (e) => {
    e.preventDefault();
    console.log(postBody);
    setLoading(true);
    const response = await createPost({ body: postBody, attachments: file });
    dispatch(addOwnPost({ post: response.data.post, author: user }));
    setLoading(false);
    setPostBody('')
    setFile(null)
  };
  const handleFile = (e) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(e.type))
      return showNotification({ title: "Only images and videos are allowed" });
    setFile(e);
  };
  return (
    <>
      <Container size="600px">
        <Header title="What's on your mind?" showGoBackButton />
        <form encType="multipart/form-data" onSubmit={createPostHandler}>
          <Textarea
            aria-label="post"
            placeholder="Type....."
            variant="filled"
            autosize
            maxRows={4}
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
          />
          <Group align="center" position="apart" mt={15}>
            <FileButton onChange={handleFile} accept="image/png,image/jpeg">
              {(props) => (
                <Tooltip
                  label="Media"
                  withArrow
                  position="bottom"
                  openDelay={200}
                >
                  <ThemeIcon
                    {...props}
                    variant="light"
                    sx={{ cursor: "pointer" }}
                  >
                    <IconPhoto />
                  </ThemeIcon>
                </Tooltip>
              )}
            </FileButton>
            <Button type="submit" loading={loading} radius="lg">
              Post
            </Button>
          </Group>
          {file && (
            <Indicator
              size={40}
              label={<IconX />}
              color="dark"
              position="top-left"
              offset={10}
              sx={{cursor: 'pointer'}}
              onClick={()=>setFile(null)}
            >
              <Image src={URL.createObjectURL(file)} />
            </Indicator>
          )}
        </form>
      </Container>
    </>
  );
}

export default CreatePost;
