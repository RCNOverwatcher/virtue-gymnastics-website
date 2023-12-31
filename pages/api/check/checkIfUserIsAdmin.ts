import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method === "GET") {
		const { user_id } = req.query;

		try {
			const user = await prisma.users.findUnique({
				where: {
					user_id: user_id as string,
				},
			});

			res.status(200).json({ isAdmin: !!user?.admin });
		} catch (error) {
			console.error("Error checking user:", error);
			res.status(500).json({ error: "Error checking user" });
		}
	}
}
