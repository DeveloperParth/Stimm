import { Skeleton } from "@mantine/core";
import React from "react";

function PostPlaceHolder() {
  return (
    <>
      <div>
        <Skeleton height={50} circle mb="xl" />
        <Skeleton height={8} width={550} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
      </div>
    </>
  );
}

export default PostPlaceHolder;
