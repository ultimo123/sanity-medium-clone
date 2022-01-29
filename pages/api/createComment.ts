import type { NextApiRequest, NextApiResponse } from "next";
import sanityClient from "@sanity/client";

type Data = {
  name: string;
};

const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
};

const client = sanityClient(config);

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { _id, name, email, comment } = JSON.parse(req.body);

  try {
    await client.create({
      _type: "comment",
      post: {
        _ref: _id,
        _type: "reference",
      },
      name,
      email,
      comment,
    });
  } catch (error) {
    return res.status(500).json({ message: "Couldnt submit comment", error });
  }

  return res.status(200).json({ message: "Comment Submitted" });
}
