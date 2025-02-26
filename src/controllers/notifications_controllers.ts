import { z } from "zod";
import { prisma } from "../config/prisma_client";
import TokenService from '../services/tokens_services';
import NotificationSchemas from "../schemas/notifications_schemas";



class NotificationsController {
  private tokenService: TokenService = new TokenService();

  // Função auxiliar para verificar e obter o userId a partir do token
  private async verifyTokenAndGetUserId(token: string): Promise<string | null> {
    try {
      
      const userId = await this.tokenService.userId(token) as unknown as string;
      if (!userId) {
        return null;
      }
      return userId;
    } catch (error) {
      return null;
    }
  }

  // Adiciona uma nova notificação
  async add( title: string,description: string,id_user: string) {

    try {
      const newNotification = await prisma.notification.create({
        data: {
          title,
          description,
          id_user,
          date: new Date(),
        },
      });
      console.log("Notification added successfully")
    } catch (error) {
      console.error("Error adding notification:", error);
     
    }
  }

  // Lê e marca a notificação como lida
  async read(data: any) {
    try {
      const { id_notification, token } = NotificationSchemas.readNotificationsSchema.parse(data);
      const userId = await this.verifyTokenAndGetUserId(token);
      
      if (!userId) {
        return { message: "Not authorized", code: 401 };
      }

      const notification = await prisma.notification.findUnique({
        where: { id_notification: id_notification, id_user: userId },
      });

      if (!notification) {
        return { message: "Notification not found", code: 404 };
      }

      const updatedNotification = await prisma.notification.update({
        where: { id_notification },
        data: { read: true },
      });

      return {
        message: "Notification marked as read successfully",
        code: 200,
        result: updatedNotification,
      };
    } catch (error) {
      console.error("Error reading notifications:", error);
      return {
        message: "Internal server error",
        code: 500,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Deleta uma notificação por ID
  async delete(data: any) {
    const validatedData = NotificationSchemas.deleteNotificationSchema.parse(data);
    const userId = await this.verifyTokenAndGetUserId(validatedData.id_notification);
    console.log(validatedData)
    if (!userId) {
      return { message: "Not authorized", code: 401 };
    }

    try {
      const deletedNotification = await prisma.notification.delete({
        where: {
          id_notification: validatedData.id_notification,
        },
      });

      return {
        message: "Notification deleted successfully",
        code: 200,
        result: deletedNotification,
      };
    } catch (error: any) {
      console.error("Error deleting notification:", error);
      if (error.code === "P2025") {
        return {
          message: "Notification not found",
          code: 404,
        };
      }
      return {
        message: "Internal server error",
        code: 500,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }


  // Visualiza notificações de um usuário específico
  async viewByUser(data: any) {
    const validatedData = NotificationSchemas.viewByUserSchema.parse(data);
    const userId = await this.verifyTokenAndGetUserId(validatedData.token);
  
    if (!userId || userId == "-1") {
      return { message: "Not authorized", code: 401 };
    }

    try {
      const userNotifications = await prisma.notification.findMany({
        where: {
          id_user:  userId,
        },
      });

      return {
        message: "User notifications retrieved successfully",
        code: 200,
        result: userNotifications,
      };
    } catch (error) {
    
      console.error("Error retrieving user notifications:", error);
      return {
        message: "Internal server error",
        code: 500,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

export default NotificationsController;
