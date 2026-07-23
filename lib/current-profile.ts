import { auth } from "./auth/server";
import { db } from "./db";

export default async function currentProfile() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      userID: session?.user.id,
    },
  });

  if (profile) {
    return profile;
  }

  const newProfile = await db.profile.create({
    data: {
      userID: session?.user.id,
      email: session?.user.email,
      name: session?.user.name,
      imageUrl: session?.user.image || "",
    },
  });

  return newProfile;
}
