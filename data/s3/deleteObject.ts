"use server";

import { revalidatePath } from "next/cache";

import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { currentUser } from "@/lib/auth";

const s3Client = new S3Client({
    region: process.env.AWS_BUCKET_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
})



export default async function deleteObject(url: string) {
    try {

      const authUser = await currentUser();
      if (!authUser) return { failure: "User not found" }

      const deleteObjectCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: url,
      })
      const s3 = await s3Client.send(deleteObjectCommand)
      return { success: "success deleting object" }
    } catch (error) {
      console.error("Error deleting s3:", error)
      return { failure: "error deleting s3 object" }
    }
}
