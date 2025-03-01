"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../atoms/card";
import NewTaskForm from "./new-task-form";

export default function TaskSection() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <NewTaskForm />
      </CardContent>
    </Card>
  );
}
