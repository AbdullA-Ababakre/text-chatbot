import * as React from "react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card"

export function AssistantChatCard({ text = "Hi, how can I help you?" }) {
  
  console.log("text111",text);

  return (
    <div className="mb-[25px] ml-[25px] mt-[20px]">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Assistant</CardTitle>
          <CardDescription>{text}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
