import { useState } from "react";
import MDEditor from '@uiw/react-md-editor';
// material
import Box from '@mui/material/Box';

export default function MarkdownEditor({ value, setValue }) {
  return (
    <Box>
      <MDEditor
        value={value}
        onChange={setValue}
      />
      {/* <MDEditor.Markdown source={value} /> */}
    </Box>
  );
};