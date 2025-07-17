// lib/sendgrid.js - Updated with Dynamic Templates
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// SendGrid Dynamic Template IDs (you'll need to create these in your SendGrid dashboard)
const TEMPLATE_IDS = {
  OTP_VERIFICATION: 'd-1e0fbf957bc048c8a4b61ba4dc483ca3',
  ORDER_CONFIRMATION: 'd-43752e5ad793461abf78723ae84bbeb8',
  ADMIN_NOTIFICATION: 'd-793370e673d64abaaf3634e32271adc4',
  STATUS_UPDATE: 'd-a3ae59bc44e24868a3ff5f89847b1584',
  PASSWORD_RESET: 'd-8ca4cc2aa1e04e2ead7340ec20319f44',
};

export const sendEmail = async (to, templateId, dynamicTemplateData, fallbackSubject = null, fallbackHtml = null) => {
  try {
    const msg = {
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: 'Haulix Shipping'
      },
    };

    if (templateId && dynamicTemplateData) {
      // Use dynamic template
      msg.templateId = templateId;
      msg.dynamicTemplateData = dynamicTemplateData;
    } else if (fallbackSubject && fallbackHtml) {
      // Fallback to custom HTML
      msg.subject = fallbackSubject;
      msg.html = fallbackHtml;
    } else {
      throw new Error('Either templateId with data or fallback subject/html must be provided');
    }

    await sgMail.send(msg);
    console.log('Email sent successfully to:', to);
    return { success: true };
  } catch (error) {
    console.error('SendGrid error:', error);
    return { success: false, error: error.message };
  }
};

export const sendOTPEmail = async (email, otp, name) => {
  const dynamicTemplateData = {
    name: name,
    otp_code: otp,
    company_name: 'Haulix',
    expiry_minutes: '10',
    support_email: 'support@haulix.delivery',
    current_year: new Date().getFullYear(),
  };

  // Fallback HTML in case template is not available
  const fallbackSubject = 'Verify Your Haulix Account';
  const fallbackHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">Welcome to Haulix!</h2>
      <p>Hi ${name},</p>
      <p>Thank you for registering with Haulix. Please use the following OTP to verify your account:</p>
      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
        <h1 style="color: #3b82f6; font-size: 32px; margin: 0;">${otp}</h1>
      </div>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br>Haulix Team</p>
    </div>
  `;

  return await sendEmail(
    email, 
    TEMPLATE_IDS.OTP_VERIFICATION, 
    dynamicTemplateData,
    fallbackSubject,
    fallbackHtml
  );
};

export const sendOrderConfirmationEmail = async (email, order, customerName) => {
  const dynamicTemplateData = {
    customer_name: customerName,
    tracking_number: order.trackingNumber,
    service_type: order.shippingInfo.service.charAt(0).toUpperCase() + order.shippingInfo.service.slice(1),
    estimated_delivery: new Date(order.shippingInfo.estimatedDelivery).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    shipping_cost: order.shippingInfo.cost,
    package_description: order.packageInfo.description,
    package_weight: `${order.packageInfo.weight}g`,
    package_value: order.packageInfo.value,
    recipient_name: order.recipientInfo.name,
    recipient_country: order.recipientInfo.address.country,
    company_name: 'Haulix',
    support_email: 'support@haulix.delivery',
    tracking_url: `${process.env.NEXTAUTH_URL}/track?tracking=${order.trackingNumber}`,
    current_year: new Date().getFullYear(),
  };

  const fallbackSubject = `Order Confirmation - ${order.trackingNumber}`;
  const fallbackHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">Order Confirmed!</h2>
      <p>Hi ${customerName},</p>
      <p>Your shipping order has been received and is being processed.</p>
      <div style="background-color: #f3f4f6; padding: 20px; margin: 20px 0;">
        <h3>Order Details:</h3>
        <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
        <p><strong>Service:</strong> ${order.shippingInfo.service}</p>
        <p><strong>Estimated Delivery:</strong> ${new Date(order.shippingInfo.estimatedDelivery).toLocaleDateString()}</p>
        <p><strong>Cost:</strong> $${order.shippingInfo.cost}</p>
      </div>
      <p>Our admin will contact you shortly regarding payment and next steps.</p>
      <p>Best regards,<br>Haulix Team</p>
    </div>
  `;

  return await sendEmail(
    email,
    TEMPLATE_IDS.ORDER_CONFIRMATION,
    dynamicTemplateData,
    fallbackSubject,
    fallbackHtml
  );
};

export const sendAdminNotificationEmail = async (order) => {
  const dynamicTemplateData = {
    tracking_number: order.trackingNumber,
    customer_name: order.senderInfo.name,
    customer_email: order.senderInfo.email,
    customer_phone: order.senderInfo.phone,
    service_type: order.shippingInfo.service.charAt(0).toUpperCase() + order.shippingInfo.service.slice(1),
    package_description: order.packageInfo.description,
    package_weight: `${order.packageInfo.weight}g`,
    package_value: order.packageInfo.value,
    package_category: order.packageInfo.category,
    shipping_cost: order.shippingInfo.cost,
    estimated_delivery: new Date(order.shippingInfo.estimatedDelivery).toLocaleDateString(),
    recipient_name: order.recipientInfo.name,
    recipient_email: order.recipientInfo.email,
    recipient_phone: order.recipientInfo.phone,
    recipient_address: `${order.recipientInfo.address.street}, ${order.recipientInfo.address.city}, ${order.recipientInfo.address.state} ${order.recipientInfo.address.zipCode}, ${order.recipientInfo.address.country}`,
    sender_address: `${order.senderInfo.address.street}, ${order.senderInfo.address.city}, ${order.senderInfo.address.state} ${order.senderInfo.address.zipCode}, ${order.senderInfo.address.country}`,
    order_date: new Date(order.createdAt || Date.now()).toLocaleDateString(),
    admin_dashboard_url: `${process.env.NEXTAUTH_URL}/admin`,
    current_year: new Date().getFullYear(),
  };

  const fallbackSubject = `🚨 New Order Received - ${order.trackingNumber}`;
  const fallbackHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">New Order Notification</h2>
      <div style="background-color: #f3f4f6; padding: 20px; margin: 20px 0;">
        <h3>Order Details:</h3>
        <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
        <p><strong>Customer:</strong> ${order.senderInfo.name}</p>
        <p><strong>Email:</strong> ${order.senderInfo.email}</p>
        <p><strong>Phone:</strong> ${order.senderInfo.phone}</p>
        <p><strong>Service:</strong> ${order.shippingInfo.service}</p>
        <p><strong>Package:</strong> ${order.packageInfo.description}</p>
        <p><strong>Value:</strong> $${order.packageInfo.value}</p>
        <p><strong>Cost:</strong> $${order.shippingInfo.cost}</p>
      </div>
      <p>Please review and process this order in the admin dashboard.</p>
    </div>
  `;

  return await sendEmail(
    process.env.ADMIN_EMAIL,
    TEMPLATE_IDS.ADMIN_NOTIFICATION,
    dynamicTemplateData,
    fallbackSubject,
    fallbackHtml
  );
};

export const sendStatusUpdateEmail = async (email, order, status, customerName) => {
  const statusMessages = {
    confirmed: {
      title: '✅ Order Confirmed',
      message: 'Your order has been confirmed and is being prepared for shipment.',
      next_step: 'We are processing your order and will update you once it ships.',
    },
    paid: {
      title: '💳 Payment Received',
      message: 'Thank you! Payment has been received and your package is being prepared.',
      next_step: 'Your package will be shipped within 24-48 hours.',
    },
    in_transit: {
      title: '🚚 Package In Transit',
      message: 'Your package is now on its way to the destination!',
      next_step: 'Track your package for real-time location updates.',
    },
    delivered: {
      title: '🎉 Package Delivered',
      message: 'Great news! Your package has been successfully delivered.',
      next_step: 'Thank you for choosing Haulix. We hope you are satisfied with our service!',
    },
  };

  const statusInfo = statusMessages[status] || statusMessages.confirmed;

  const dynamicTemplateData = {
    customer_name: customerName,
    tracking_number: order.trackingNumber,
    status_title: statusInfo.title,
    status_message: statusInfo.message,
    next_step: statusInfo.next_step,
    current_status: status.replace('_', ' ').toUpperCase(),
    last_updated: new Date().toLocaleString(),
    estimated_delivery: status !== 'delivered' ? new Date(order.shippingInfo.estimatedDelivery).toLocaleDateString() : null,
    is_delivered: status === 'delivered',
    tracking_url: `${process.env.NEXTAUTH_URL}/track?tracking=${order.trackingNumber}`,
    company_name: 'Haulix',
    support_email: 'support@haulix.delivery',
    current_year: new Date().getFullYear(),
  };

  const fallbackSubject = `${statusInfo.title} - ${order.trackingNumber}`;
  const fallbackHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">${statusInfo.title}</h2>
      <p>Hi ${customerName},</p>
      <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
      <p><strong>Status:</strong> ${status.toUpperCase()}</p>
      <p>${statusInfo.message}</p>
      <p>You can track your order for real-time updates.</p>
      <p>Best regards,<br>Haulix Team</p>
    </div>
  `;

  return await sendEmail(
    email,
    TEMPLATE_IDS.STATUS_UPDATE,
    dynamicTemplateData,
    fallbackSubject,
    fallbackHtml
  );
};

export const sendPasswordResetEmail = async (email, resetToken, name) => {
  const dynamicTemplateData = {
    name: name,
    reset_url: `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`,
    expiry_hours: '1',
    company_name: 'Haulix',
    support_email: 'support@haulix.delivery',
    current_year: new Date().getFullYear(),
  };

  const fallbackSubject = 'Reset Your Haulix Password';
  const fallbackHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">Password Reset Request</h2>
      <p>Hi ${name},</p>
      <p>We received a request to reset your Haulix account password.</p>
      <p>Click the link below to reset your password (expires in 1 hour):</p>
      <p><a href="${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a></p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br>Haulix Team</p>
    </div>
  `;

  return await sendEmail(
    email,
    TEMPLATE_IDS.PASSWORD_RESET,
    dynamicTemplateData,
    fallbackSubject,
    fallbackHtml
  );
};
