import * as React from "react";

import { Card, CardDescription, CardHeader, CardTitle } from "./card";

export function UserChatCard({ text = "", userName = "User" }) {
  return (
    <div className="mb-[25px] mr-[25px] mt-[20px] flex items-end justify-end">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle type="user">{userName}</CardTitle>
          <CardDescription type="user">{text}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
