import { z } from "zod";

class NotificationSchemas {
  // Schema para adicionar uma notificação
  static addNotificationSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    id_user: z.number().int().min(1, "User ID must be a positive integer"),
  });

  // Schema para leitura de notificações
  static readNotificationsSchema = z.object({
    id_notification: z.string().min(1, "id_notification is required"),
    token: z.string().min(1, "Token is required"),
  });

  // Schema para deletar uma notificação
  static deleteNotificationSchema = z.object({
    id_notification: z.string().min(1, "id_notification is required"),
    token:z.string()
  });

  // Schema para visualizar notificações por usuário
  static viewByUserSchema = z.object({
    token:z.string()
  });

  // Schema de resposta padrão (default response)
  static defaultResponseSchema = z.object({
    message: z.string(),
    code: z.number(),
    error: z.string().optional(), // O erro pode ser opcional
  });

  // Schema de resposta para leitura de notificações
  static readNotificationsResponseSchema = z.object({
    message: z.string(),
    code: z.number(),
    error: z.string().optional(), 
  });

  static viewResponseSchema = z.object({
    message: z.string(),
    code: z.number(),
    error: z.string().optional(), 
    result:z.array(z.object({
      title: z.string(),
      description: z.string(),
      id_user: z.string(),
      id_notification: z.string(),
      date: z.date(),
      read: z.boolean(),
    })).optional()
  });

}

export default NotificationSchemas;
