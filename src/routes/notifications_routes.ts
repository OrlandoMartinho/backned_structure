import { FastifyTypedInstance } from "../types/fastify_types";
import NotificationsController from "../controllers/notifications_controllers";
import NotificationSchemas from "../schemas/notifications_schemas";

export async function notificationRoutes(app: FastifyTypedInstance) {
  const controller = new NotificationsController();

  // Read all notifications
  app.post(
    "/notifications/read",
    {
      schema: {
        description: "Read all notifications",
        tags: ["notifications"],
        body: NotificationSchemas.readNotificationsSchema,
        response: {
          200: NotificationSchemas.readNotificationsResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const data = NotificationSchemas.readNotificationsSchema.parse(request.body);
        const result = await controller.read(data);
        return reply.send(result);
      } catch (error) {
        console.error("Error reading notifications:", error);
        return reply.status(500).send({
          message: "Internal server error",
          code: 500,
          error: error instanceof Error ? error.message : "Error reading notifications",
        });
      }
    }
  );

  // Delete a notification
  app.post(
    "/notifications/delete",
    {
      schema: {
        description: "Delete a notification",
        tags: ["notifications"],
        body: NotificationSchemas.deleteNotificationSchema,
        response: {
          200: NotificationSchemas.defaultResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const data = NotificationSchemas.deleteNotificationSchema.parse(request.body);
        const result = await controller.delete(data);
        return reply.send(result);
      } catch (error) {
        console.error("Error deleting notification:", error);
        return reply.status(500).send({
          message: "Internal server error",
          code: 500,
          error: error instanceof Error ? error.message : "Error deleting notification",
        });
      }
    }
  );

  // View notifications by user
  app.post(
    "/notifications/view_by_user",
    {
      schema: {
        description: "View notifications by user",
        tags: ["notifications"],
        body: NotificationSchemas.viewByUserSchema,
        response: {
          200: NotificationSchemas.viewResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const data = NotificationSchemas.viewByUserSchema.parse(request.body);
        const result = await controller.viewByUser(data);
        return reply.send(result);
      } catch (error) {
        console.error("Error viewing notifications:", error);
        return reply.status(500).send({
          message: "Internal server error",
          code: 500,
          error: error instanceof Error ? error.message : "Error viewing notifications",
        });
      }
    }
  );
}
