import { NextApiRequest, NextApiResponse } from "next";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const data: { [ip: string]: Todo[] } = {};

const getRequestIp = (req: NextApiRequest) => {
  const fowardedFor = req.headers["x-forwarded-for"];
  if (!fowardedFor) {
    return "localhost";
  }
  return Array.isArray(fowardedFor) ? fowardedFor[0] : fowardedFor;
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  const ip = getRequestIp(req);
  if (req.method === "PUT") {
    data[ip] = req.body;
  }
  res.json(data[ip] || []);
};
