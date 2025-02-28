import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export default async function currentProfile() {
  const user = await currentUser();

  if (!user) {
    (await auth()).redirectToSignIn();
    return;
  }

  const profile = await db.profile.findUnique({
    where: {
      userID: user.id,
    },
  });

  if (profile) {
    return profile;
  }

  const newProfile = await db.profile.create({
    data: {
      userID: user.id,
      email: user.emailAddresses[0].emailAddress,
      imageUrl: user.imageUrl,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
    },
  });

  return newProfile;
}
