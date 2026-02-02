import { v } from "convex/values";
import { query, mutation, action, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { Resend } from "@convex-dev/resend";
import { componentsGeneric } from "convex/server";

const internalApi = internal as any;

// Initialize Resend client
// testMode: true = emails are logged but not sent (safe for dev)
// testMode: false + RESEND_API_KEY set = real emails sent
const components = componentsGeneric() as any;

const resend = new Resend(components.resend, {
  testMode: process.env.RESEND_TEST_MODE !== "false",
});

// Log configuration on load
console.log("[EMAIL] Resend configured:", {
  testMode: process.env.RESEND_TEST_MODE !== "false",
  hasApiKey: !!process.env.RESEND_API_KEY,
});

// ============== NEWSLETTER SUBSCRIPTIONS ==============

/**
 * Public: Subscribe to newsletter
 */
export const subscribe = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    source: v.optional(v.string()),
  },
  handler: async (ctx, { email, name, source }) => {
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed
    const existing = await ctx.db
      .query("newsletter_subscriptions")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();

    if (existing) {
      if (existing.status === "active") {
        return { success: false, message: "Cet email est déjà inscrit" };
      }
      // Reactivate if unsubscribed
      await ctx.db.patch(existing._id, {
        status: "active",
        subscribedAt: Date.now(),
        name: name || existing.name,
      });
      return { success: true, message: "Inscription réactivée", id: existing._id };
    }

    // Create new subscription
    const id = await ctx.db.insert("newsletter_subscriptions", {
      email: normalizedEmail,
      name: name || undefined,
      subscribedAt: Date.now(),
      status: "active",
      source: source || "website",
    });

    return { success: true, message: "Inscription réussie", id };
  },
});

/**
 * Public: Unsubscribe from newsletter
 */
export const unsubscribe = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await ctx.db
      .query("newsletter_subscriptions")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();

    if (!existing) {
      return { success: false, message: "Email non trouvé" };
    }

    await ctx.db.patch(existing._id, {
      status: "unsubscribed",
    });

    return { success: true, message: "Désinscription réussie" };
  },
});

/**
 * Admin: List all newsletter subscriptions
 */
export const listSubscriptions = query({
  args: {
    status: v.optional(v.union(v.literal("active"), v.literal("unsubscribed"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { status, limit = 1000 }) => {
    if (status) {
      return await ctx.db
        .query("newsletter_subscriptions")
        .withIndex("by_status", (q) => q.eq("status", status))
        .order("desc")
        .take(limit);
    }

    return await ctx.db
      .query("newsletter_subscriptions")
      .order("desc")
      .take(limit);
  },
});

/**
 * Admin: Count subscriptions by status
 */
export const countSubscriptions = query({
  args: {
    status: v.optional(v.union(v.literal("active"), v.literal("unsubscribed"))),
  },
  handler: async (ctx, { status }) => {
    if (status) {
      const items = await ctx.db
        .query("newsletter_subscriptions")
        .withIndex("by_status", (q) => q.eq("status", status))
        .collect();
      return items.length;
    }

    const items = await ctx.db.query("newsletter_subscriptions").collect();
    return items.length;
  },
});

/**
 * Admin: Delete a subscription
 */
export const deleteSubscription = mutation({
  args: {
    id: v.id("newsletter_subscriptions"),
  },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return { success: true };
  },
});

/**
 * Generate HTML email template for contact form notification
 */
function generateContactEmailHtml(
  name: string,
  email: string,
  subject: string,
  message: string,
  phone?: string,
  department?: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .header h2 { margin: 0; color: #2563eb; }
    .content { background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
    .field { margin-bottom: 15px; }
    .field-label { font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase; }
    .field-value { margin-top: 5px; }
    .message-box { background: #f3f4f6; padding: 15px; border-radius: 6px; margin-top: 10px; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Nouveau message de contact</h2>
      <p>Un message a été reçu via le formulaire de contact du site web.</p>
    </div>
    
    <div class="content">
      <div class="field">
        <div class="field-label">De</div>
        <div class="field-value">${escapeHtml(name)} (${escapeHtml(email)})</div>
      </div>
      
      <div class="field">
        <div class="field-label">Sujet</div>
        <div class="field-value">${escapeHtml(subject)}</div>
      </div>
      
      ${phone ? `
      <div class="field">
        <div class="field-label">Téléphone</div>
        <div class="field-value">${escapeHtml(phone)}</div>
      </div>
      ` : ''}
      
      ${department ? `
      <div class="field">
        <div class="field-label">Service concerné</div>
        <div class="field-value">${escapeHtml(department)}</div>
      </div>
      ` : ''}
      
      <div class="field">
        <div class="field-label">Message</div>
        <div class="message-box">${escapeHtml(message).replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    
    <div class="footer">
      <p>Ce message a été envoyé depuis le site web Les Hirondelles.</p>
      <p>Connectez-vous à l'administration pour répondre : <a href="https://leshirondelles.sn/admin/messages">Voir les messages</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const div = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, (m) => div[m as keyof typeof div]);
}

/**
 * Public: Submit a contact form message
 */
export const submitMessage = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
    department: v.optional(v.string()),
  },
  handler: async (ctx, { name, email, phone, subject, message, department }) => {
    const settings = await ctx.runQuery(internalApi.siteSettings.getSiteSettingsInternal, {});

    // Validate required fields
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      throw new Error("Tous les champs obligatoires doivent être remplis");
    }

    // Create the message
    const id = await ctx.db.insert("contact_messages", {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || undefined,
      subject: subject.trim(),
      message: message.trim(),
      department: department || undefined,
      status: "new",
      receivedAt: Date.now(),
    });

    // Send email notification to admin
    const adminEmail = settings?.emailGeneral || settings?.emailDirection;
    console.log("[CONTACT] Preparing to send email to:", adminEmail);
    
    if (adminEmail) {
      const emailHtml = generateContactEmailHtml(
        name.trim(),
        email.toLowerCase().trim(),
        subject.trim(),
        message.trim(),
        phone?.trim(),
        department || undefined
      );

      // Use RESEND_FROM_EMAIL env var if set (must be from verified domain)
      // Otherwise use Resend's test sender onboarding@resend.dev
      const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
      
      await ctx.runMutation(internalApi.email.sendContactNotificationEmail, {
        to: adminEmail,
        from: `Formulaire Contact <${fromEmail}>`,
        subject: `Nouveau message: ${subject.trim()}`,
        html: emailHtml,
        replyTo: email.toLowerCase().trim(),
        messageId: id,
      });
    } else {
      console.warn("[CONTACT] No admin email configured, skipping email notification");
    }

    return { success: true, message: "Message envoyé avec succès", id };
  },
});

/**
 * Internal: Send contact notification email via Resend
 * Logs detailed info for debugging
 */
export const sendContactNotificationEmail = internalMutation({
  args: {
    to: v.string(),
    from: v.string(),
    subject: v.string(),
    html: v.string(),
    replyTo: v.optional(v.string()),
    messageId: v.optional(v.id("contact_messages")),
  },
  handler: async (ctx, { to, from, subject, html, replyTo, messageId }) => {
    console.log("[EMAIL] Attempting to send email:", {
      to,
      from,
      subject,
      replyTo,
      messageId,
      testMode: process.env.RESEND_TEST_MODE !== "false",
      hasApiKey: !!process.env.RESEND_API_KEY,
    });

    try {
      const result = await resend.sendEmail(ctx, {
        from,
        to,
        subject,
        html,
        replyTo: replyTo ? [replyTo] : undefined,
      });
      
      console.log("[EMAIL] Successfully sent:", {
        to,
        messageId,
        result,
      });

      // Update message with email status
      if (messageId) {
        await ctx.db.patch(messageId, {
          emailSent: true,
          emailSentAt: Date.now(),
          emailError: undefined,
          emailTo: to,
        });
      }

      return { success: true, result };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("[EMAIL] Failed to send:", {
        to,
        messageId,
        error: errorMessage,
      });

      // Update message with error
      if (messageId) {
        await ctx.db.patch(messageId, {
          emailSent: false,
          emailError: errorMessage,
        });
      }

      // Don't throw - we don't want to fail the mutation if email fails
      return { success: false, error: errorMessage };
    }
  },
});

export const listMessages = query({
  args: {
    status: v.optional(v.union(v.literal("new"), v.literal("read"), v.literal("replied"), v.literal("archived"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { status, limit = 100 }) => {
    if (status) {
      return await ctx.db
        .query("contact_messages")
        .withIndex("by_status", (q) => q.eq("status", status))
        .order("desc")
        .take(limit);
    }

    return await ctx.db.query("contact_messages").order("desc").take(limit);
  },
});

/**
 * Admin: Get a single message
 */
export const getMessage = query({
  args: {
    id: v.id("contact_messages"),
  },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

/**
 * Admin: Mark message as read
 */
export const markAsRead = mutation({
  args: {
    id: v.id("contact_messages"),
  },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { status: "read" });
    return { success: true };
  },
});

/**
 * Admin: Reply to a message
 */
export const replyToMessage = mutation({
  args: {
    id: v.id("contact_messages"),
    replyMessage: v.string(),
  },
  handler: async (ctx, { id, replyMessage }) => {
    await ctx.db.patch(id, {
      status: "replied",
      replyMessage: replyMessage.trim(),
      repliedAt: Date.now(),
    });

    // TODO: Send email reply to the sender
    // This would use an action to call an external email service

    return { success: true };
  },
});

/**
 * Admin: Resend email notification for a message
 */
export const resendNotification = mutation({
  args: {
    id: v.id("contact_messages"),
    customEmail: v.optional(v.string()), // Optional: send to different email
  },
  handler: async (ctx, { id, customEmail }) => {
    const message = await ctx.db.get(id);
    if (!message) {
      throw new Error("Message non trouvé");
    }

    // Get settings for default email
    const settings = await ctx.runQuery(internalApi.siteSettings.getSiteSettingsInternal, {});
    const adminEmail = customEmail || settings?.emailGeneral || settings?.emailDirection;

    if (!adminEmail) {
      throw new Error("Aucune adresse email configurée");
    }

    const emailHtml = generateContactEmailHtml(
      message.name,
      message.email,
      message.subject,
      message.message,
      message.phone,
      message.department
    );

    // Use RESEND_FROM_EMAIL env var if set (must be from verified domain)
    // Otherwise use Resend's test sender onboarding@resend.dev
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    
    await ctx.runMutation(internalApi.email.sendContactNotificationEmail, {
      to: adminEmail,
      from: `Formulaire Contact <${fromEmail}>`,
      subject: `Nouveau message: ${message.subject}`,
      html: emailHtml,
      replyTo: message.email,
      messageId: id,
    });

    return { success: true, emailTo: adminEmail };
  },
});

/**
 * Admin: Archive a message
 */
export const archiveMessage = mutation({
  args: {
    id: v.id("contact_messages"),
  },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { status: "archived" });
    return { success: true };
  },
});

/**
 * Admin: Delete a message
 */
export const deleteMessage = mutation({
  args: {
    id: v.id("contact_messages"),
  },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return { success: true };
  },
});

/**
 * Admin: List contact messages by status
 */
export const countMessages = query({
  args: {
    status: v.optional(v.union(v.literal("new"), v.literal("read"), v.literal("replied"), v.literal("archived"))),
  },
  handler: async (ctx, { status }) => {
    if (status) {
      const items = await ctx.db
        .query("contact_messages")
        .withIndex("by_status", (q) => q.eq("status", status))
        .collect();
      return items.length;
    }

    const items = await ctx.db.query("contact_messages").collect();
    return items.length;
  },
});

// ============== EMAIL SENDING (External Service Integration) ==============

/**
 * Action: Send email via external service (Resend, SendGrid, etc.)
 * This runs on Convex's edge runtime and can make HTTP requests
 */
export const sendEmail = action({
  args: {
    to: v.string(),
    subject: v.string(),
    html: v.string(),
    from: v.optional(v.string()),
  },
  handler: async (ctx, { to, subject, html, from }) => {
    // Get site settings for default from address
    const settings = await ctx.runQuery(internal.siteSettings.getSiteSettingsInternal, {});
    const fromAddress = from || settings?.emailGeneral || "noreply@leshirondelles.sn";

    // Note: In production, you would integrate with an email service like Resend
    // Example with Resend:
    /*
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send email: ${await response.text()}`);
    }

    return await response.json();
    */

    // For now, log the email that would be sent
    console.log("[EMAIL] Would send:", {
      from: fromAddress,
      to,
      subject,
      htmlLength: html.length,
    });

    return { success: true, message: "Email logged (integration pending)" };
  },
});
