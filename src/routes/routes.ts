import { FastifyInstance } from "fastify";
import z from "zod";
import type { FastifyTypedInstance } from "../types/fastify_types";
import { randomUUID } from "node:crypto";
import {notificationRoutes} from "../routes/notifications_routes"



export async function routes(app:FastifyTypedInstance) {
 
  notificationRoutes(app)
 
}