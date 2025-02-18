
import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { pingOpenAI } from "openaiService";

export default function App() {
  const [response, setResponse] = useState(null);

  const handlePing = async () => {
    const result = await pingOpenAI();
    setResponse(result?.choices?.[0]?.message?.content || "No response");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Ping OpenAI" onPress={handlePing} />
      {response && <Text style={{ marginTop: 20 }}>{response}</Text>}
    </View>
  );
}
