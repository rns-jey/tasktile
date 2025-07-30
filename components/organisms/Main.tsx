"use client";

import TaskSection from "./TaskSection";
import AnalyticsSection from "./AnalyticsSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../atoms/tabs";
import { Card, CardContent, CardFooter, CardHeader } from "../atoms/card";
import { Separator } from "../atoms/separator";

export default function Main() {
  return (
    <main className="flex w-full max-w-7xl flex-row items-start gap-4 p-4">
      <Tabs
        orientation="vertical"
        defaultValue="tasks"
        className="flex w-full flex-row"
      >
        <Card className="h-full w-full max-w-xs gap-4 py-4">
          <CardHeader className="px-4">
            <h2>Dashboard</h2>
            <p>Manage your tasks and track progress</p>
          </CardHeader>
          <CardContent className="flex h-full w-full flex-col px-4">
            <TabsList className="flex h-full w-full flex-col items-start gap-2 bg-transparent">
              <TabsTrigger value="tasks" className="w-full">
                Tasks
              </TabsTrigger>
              <TabsTrigger value="analytics" className="w-full">
                Analytics
              </TabsTrigger>
            </TabsList>

            <Separator className="my-1" />

            <h3>Categories</h3>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <h3>Completed</h3>
              <p>0</p>
            </div>
            <div>
              <h3>Active</h3>
              <p>1</p>
            </div>
          </CardFooter>
        </Card>
        <TabsContent value="tasks" className="w-full">
          <TaskSection />
        </TabsContent>
        <TabsContent value="analytics">
          <AnalyticsSection />
        </TabsContent>
      </Tabs>
    </main>
  );
}
