import { cache } from "react";
import { auth } from "./auth/server";
import { db } from "./db";

const currentProfile = cache(async () => {
  const { data: session } = await auth.getSession();

  if (!session?.user) return null;

  return db.profile.upsert({
    where: { userID: session.user.id },
    update: {},
    create: {
      userID: session.user.id,
      email: session.user.email,
      name: session.user.name,
      imageUrl: session.user.image ?? "",
    },
  });
});

export default currentProfile;
