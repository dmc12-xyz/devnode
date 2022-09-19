import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { challengeCode } = req.query;

  let details = await prisma.discordChallenge
    .findFirstOrThrow({
      where: {
        challengeCode: String(challengeCode),
      },
    })
    .catch((e) => {
      res.status(200).json({ error: "Error fetching from the db" });
      return;
    });

  if (!details || !details.username) {
    res.status(200).json({ error: "No db entry" });
    return;
  }

  if (challengeCode != details.challengeCode) {
    res.status(200).json({ error: "Challenge code incorrect" });
    return;
  }

  res.status(200).json({
    success: `Challenge code correct: ${details.username}, ${details.did}`,
  });
}
