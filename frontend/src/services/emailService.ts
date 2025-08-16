// Servicio para envío de emails usando EmailJS
// EmailJS permite enviar emails directamente desde el frontend sin necesidad de backend

export interface EmailInvitation {
  recipientEmail: string;
  recipientName?: string;
  senderName: string;
  groupName: string;
  inviteCode: string;
  message: string;
  appUrl: string;
}

export interface GroupJoinNotification {
  recipientEmail: string;
  recipientName: string;
  newMemberName: string;
  groupName: string;
  memberCount: number;
  appUrl: string;
}

class EmailService {
  private serviceId: string;
  private templateId: string;
  private publicKey: string;
  private isConfigured: boolean;

  constructor() {
    // Configuración de EmailJS desde variables de entorno
    this.serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
    this.templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
    this.publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
    
    this.isConfigured = !!(this.serviceId && this.templateId && this.publicKey);
    
    if (!this.isConfigured) {
      console.warn('⚠️ EmailJS no está configurado. Las invitaciones se simularán.');
      console.info('Para configurar EmailJS, agrega las siguientes variables a .env.local:');
      console.info('VITE_EMAILJS_SERVICE_ID=tu_service_id');
      console.info('VITE_EMAILJS_TEMPLATE_ID=tu_template_id');
      console.info('VITE_EMAILJS_PUBLIC_KEY=tu_public_key');
    }
  }

  // Enviar invitación por email
  async sendGroupInvitation(invitation: EmailInvitation): Promise<boolean> {
    try {
      if (!this.isConfigured) {
        // Simular envío si no está configurado
        return this.simulateEmailSend(invitation);
      }

      // Cargar EmailJS dinámicamente
      const emailjs = await this.loadEmailJS();
      
      const templateParams = {
        to_email: invitation.recipientEmail,
        to_name: invitation.recipientName || 'Amigo',
        from_name: invitation.senderName,
        group_name: invitation.groupName,
        invite_code: invitation.inviteCode,
        message: invitation.message,
        app_url: invitation.appUrl,
        join_url: `${invitation.appUrl}?invite=${invitation.inviteCode}`
      };

      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams,
        this.publicKey
      );

      if (response.status === 200) {
        console.log('✅ Email enviado exitosamente:', response);
        return true;
      } else {
        console.error('❌ Error al enviar email:', response);
        return false;
      }
    } catch (error) {
      console.error('❌ Error en el servicio de email:', error);
      return false;
    }
  }

  // Enviar notificación al dueño cuando alguien se une al grupo
  async sendGroupJoinNotification(notification: GroupJoinNotification): Promise<boolean> {
    try {
      if (!this.isConfigured) {
        // Simular envío si no está configurado
        return this.simulateJoinNotificationSend(notification);
      }

      // Cargar EmailJS dinámicamente
      const emailjs = await this.loadEmailJS();
      
      const templateParams = {
        to_email: notification.recipientEmail,
        to_name: notification.recipientName,
        new_member_name: notification.newMemberName,
        group_name: notification.groupName,
        member_count: notification.memberCount.toString(),
        app_url: notification.appUrl,
        subject: `¡Nuevo miembro en ${notification.groupName}!`,
        message: `¡Hola ${notification.recipientName}! 🎉\n\n${notification.newMemberName} se ha unido a tu grupo "${notification.groupName}". ¡Ahora son ${notification.memberCount} miembros!\n\nVisita la aplicación para ver la actividad del grupo: ${notification.appUrl}\n\n¡Salud! 🍻`
      };

      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams,
        this.publicKey
      );

      if (response.status === 200) {
        console.log('✅ Notificación de nuevo miembro enviada exitosamente');
        return true;
      } else {
        console.error('❌ Error en la respuesta de EmailJS:', response);
        return false;
      }
    } catch (error) {
      console.error('❌ Error al enviar notificación de nuevo miembro:', error);
      return false;
    }
  }

  // Cargar EmailJS dinámicamente
  private async loadEmailJS(): Promise<EmailJSType> {
    try {
      // Verificar si EmailJS ya está cargado
      if (typeof window !== 'undefined') {
        const emailjs = (window as EmailJSWindow).emailjs;
        if (emailjs) {
          return emailjs;
        }
      }

      // Cargar EmailJS desde CDN
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      script.async = true;
      
      return new Promise((resolve, reject) => {
        script.onload = () => {
          const emailjs = (window as EmailJSWindow).emailjs;
          if (emailjs) {
            // Inicializar EmailJS
            emailjs.init(this.publicKey);
            resolve(emailjs);
          } else {
            reject(new Error('EmailJS no se cargó correctamente'));
          }
        };
        
        script.onerror = () => {
          reject(new Error('Error al cargar EmailJS'));
        };
        
        document.head.appendChild(script);
      });
    } catch {
      throw new Error('No se pudo cargar EmailJS');
    }
  }

  // Simular envío de email para desarrollo
  private async simulateEmailSend(invitation: EmailInvitation): Promise<boolean> {
    console.log('📧 Simulando envío de email...');
    console.log('Para:', invitation.recipientEmail);
    console.log('Asunto: Invitación a grupo BarXP -', invitation.groupName);
    console.log('Mensaje:', invitation.message);
    console.log('Código de invitación:', invitation.inviteCode);
    console.log('URL de la app:', invitation.appUrl);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simular éxito en el 90% de los casos
    const success = Math.random() > 0.1;
    
    if (success) {
      console.log('✅ Email simulado enviado exitosamente');
    } else {
      console.log('❌ Error simulado al enviar email');
    }
    
    return success;
  }

  // Simular envío de notificación de nuevo miembro
  private async simulateJoinNotificationSend(notification: GroupJoinNotification): Promise<boolean> {
    console.log('📧 Simulando envío de notificación de nuevo miembro...');
    console.log('📧 Para:', notification.recipientEmail);
    console.log('📧 Asunto: ¡Nuevo miembro en', notification.groupName + '!');
    console.log('📧 Nuevo miembro:', notification.newMemberName);
    console.log('📧 Total miembros:', notification.memberCount);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular éxito (95% de las veces)
    const success = Math.random() > 0.05;
    
    if (success) {
      console.log('✅ Notificación simulada enviada exitosamente');
    } else {
      console.log('❌ Fallo simulado en el envío de la notificación');
    }
    
    return success;
  }

  // Validar email
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Generar mensaje de invitación predeterminado
  generateInvitationMessage(senderName: string, groupName: string, memberCount: number): string {
    return (
      `🎯 ¡Desafío BarXP Activado! 🍻\n\n` +
      `¡Hola! ${senderName} te invita a unirte al grupo "${groupName}" en BarXP - la app que convierte cada trago en una aventura épica.\n\n` +
      `🏆 ¿Estás listo para el reto?\n` +
      `• Compite con ${senderName} y otros ${memberCount} miembros\n` +
      `• Gana XP por cada trago que registres\n` +
      `• Sube de nivel y desbloquea logros únicos\n` +
      `• Demuestra quién es el verdadero maestro de la vida nocturna\n\n` +
      `💪 Este no es solo un juego... es un estilo de vida.\n` +
      `¿Tienes lo que se necesita para llegar a la cima del ranking?\n\n` +
      `🔥 Acepta el desafío y únete ahora!\n\n` +
      `¡Nos vemos en la batalla! 🥂\n` +
      `- ${senderName}`
    );
  }

  // Verificar si el servicio está configurado
  isConfiguredProperly(): boolean {
    return this.isConfigured;
  }

  // Obtener instrucciones de configuración
  getConfigurationInstructions(): string {
    return (
      'Para configurar el envío de emails reales:\n\n' +
      '1. Crea una cuenta en https://www.emailjs.com/\n' +
      '2. Configura un servicio de email (Gmail, Outlook, etc.)\n' +
      '3. Crea un template de email\n' +
      '4. Agrega las siguientes variables a tu archivo .env.local:\n\n' +
      'VITE_EMAILJS_SERVICE_ID=tu_service_id\n' +
      'VITE_EMAILJS_TEMPLATE_ID=tu_template_id\n' +
      'VITE_EMAILJS_PUBLIC_KEY=tu_public_key\n\n' +
      'Mientras tanto, las invitaciones se simularán en la consola.'
    );
  }
}

export const emailService = new EmailService();

// Tipos para TypeScript
interface EmailJSResponse {
  status: number;
  text: string;
}

interface EmailJSType {
  send(serviceId: string, templateId: string, templateParams: Record<string, string>, publicKey: string): Promise<EmailJSResponse>;
  init(publicKey: string): void;
}

interface EmailJSWindow extends Window {
  emailjs?: EmailJSType;
}