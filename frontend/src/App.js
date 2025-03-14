import React, { useState, useEffect, useRef } from "react";
import { Editor } from "@monaco-editor/react";

const WS_URL = "ws://localhost:8080/ws/code-editor"; // WebSocket backend URL

function App() {
  const [code, setCode] = useState("// Type your code here...");
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => console.log("Connected to WebSocket");
    ws.current.onmessage = (event) => setCode(event.data);
    ws.current.onerror = (error) => console.error("WebSocket Error:", error);
    ws.current.onclose = () => console.log("WebSocket Disconnected");

    return () => ws.current.close(); // Clean up WebSocket connection on unmount
  }, []);

  const handleEditorChange = (newCode) => {
    setCode(newCode);
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(newCode); // Send code updates to the WebSocket server
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Editor
        height="100%"
        theme="vs-dark"
        defaultLanguage="javascript"
        value={code}
        onChange={handleEditorChange}
      />
    </div>
  );
}

export default App;