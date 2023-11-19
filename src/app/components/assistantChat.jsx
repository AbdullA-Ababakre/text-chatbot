import * as React from "react";

import { Card, CardDescription, CardHeader, CardTitle } from "./card";

export function AssistantChatCard({
  text = "Hi, how can I help you?",
  assistantName = "Assistant",
}) {
  return (
    <div className="mb-[25px] lg:ml-[25px] md:ml-[15px] mt-[20px]">
      <Card className="md:w-[350px] lg:md:w-[350px]">
        <CardHeader>
          <CardTitle>{assistantName}</CardTitle>
          <CardDescription>{text}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
