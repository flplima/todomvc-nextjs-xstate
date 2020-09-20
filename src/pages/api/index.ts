import { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";

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

const bodySchema = Joi.array()
  .items({
    id: Joi.number().required(),
    title: Joi.string().required(),
    completed: Joi.boolean().required(),
  })
  .required();

/**
 * TodoMVC API
 * ----------------
 * PUT /api/ -> Persists and returns all todos from this user (ip based)
 * GET /api/ -> Returns all todos from this user (ip based)
 * GET /api/?all -> Returns all todos from all users
 */
export default (req: NextApiRequest, res: NextApiResponse) => {
  const ip = getRequestIp(req);

  if ("all" in req.query && req.method === "GET") {
    return res.json(data);
  }

  if (req.method === "PUT") {
    const { error, value } = bodySchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ error: "BAD_REQUEST", details: error.details });
    }
    data[ip] = value;
  }

  res.json(data[ip] || []);
};
