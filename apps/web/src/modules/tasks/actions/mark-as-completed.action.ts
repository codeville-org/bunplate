"use server";

import { revalidatePath } from "next/cache";
import { getClient } from "@/lib/rpc/server";
import { type UpdateTaskT } from "core/zod";

export async function markAsCompleted(id: number, data: UpdateTaskT) {
  const client = await getClient();

  const response = await client.api.tasks[":id"].$patch({
    json: { done: data.done || false },
    param: { id: id.toString() }
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Failed to mark task as completed:", errorData);
    throw new Error(errorData.message || "Failed to mark task as completed");
  }

  // Revalidate the page to show the new task
  revalidatePath("/");
}
