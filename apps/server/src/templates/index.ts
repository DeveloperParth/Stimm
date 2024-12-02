import { render } from "@react-email/components";
import path from "path";
import react from "react";

export const compile = async (fileName: string, data: Record<string, any>) => {
  fileName = `${fileName}.jsx`;
  const filePath = path.join(__dirname, fileName);
  const Component = require(filePath).default;
  if (!Component) {
    throw new Error(`Component not found in file: ${fileName}`);
  }
  const html = render(react.createElement(Component, data), {});
  return html;
};
