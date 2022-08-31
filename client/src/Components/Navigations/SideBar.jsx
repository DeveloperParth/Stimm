import { Anchor, Aside, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import React from "react";
import { Link } from "react-router-dom";

function SideBar() {
  return (
    <>
      <div className={"side-nav bar"}>
        <div className="header-container">
          <Aside withBorder px="xs">
            <div className="search">
              <TextInput icon={<IconSearch />} placeholder="Search..." />
            </div>
            <div className="policies">
              <Anchor component={Link} to="#">
                Terms Of Service
              </Anchor>
              <Anchor component={Link} to="#">
                Privacy Policy
              </Anchor>
              <Anchor component={Link} to="#">
                Help Center
              </Anchor>
            </div>
          </Aside>
        </div>
      </div>
    </>
  );
}

export default SideBar;
