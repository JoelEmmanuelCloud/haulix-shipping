// utils/emailTemplates.js
export const emailTemplates = {
  // OTP Verification Template
  otpVerification: (name, otp) => ({
    subject: 'Verify Your Haulix Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Account</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
          .otp-box { background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 3px; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #6b7280; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Haulix!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>Thank you for registering with Haulix. To complete your registration, please verify your email address using the OTP code below:</p>
            
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
              <p style="margin: 10px 0 0 0; color: #6b7280;">This code will expire in 10 minutes</p>
            </div>
            
            <p>If you didn't create an account with Haulix, please ignore this email.</p>
            
            <p>Best regards,<br>The Haulix Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Haulix. All rights reserved.</p>
            <p>Ukraine's trusted international shipping partner</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Order Confirmation Template
  orderConfirmation: (order, customerName) => ({
    subject: `Order Confirmation - ${order.trackingNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
          .order-box { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
          .info-item { background: #f9fafb; padding: 15px; border-radius: 6px; }
          .info-label { font-weight: bold; color: #374151; margin-bottom: 5px; }
          .info-value { color: #6b7280; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #6b7280; }
          .track-button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }
          .highlight { color: #3b82f6; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmed! 📦</h1>
          </div>
          <div class="content">
            <h2>Hi ${customerName},</h2>
            <p>Your shipping order has been received and is being processed. Here are your order details:</p>
            
            <div class="order-box">
              <h3>Order Summary</h3>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Tracking Number</div>
                  <div class="info-value highlight">${order.trackingNumber}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Service Type</div>
                  <div class="info-value">${order.shippingInfo.service.charAt(0).toUpperCase() + order.shippingInfo.service.slice(1)}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Estimated Delivery</div>
                  <div class="info-value">${new Date(order.shippingInfo.estimatedDelivery).toLocaleDateString()}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Shipping Cost</div>
                  <div class="info-value highlight">$${order.shippingInfo.cost}</div>
                </div>
              </div>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <p><strong>📞 Next Steps:</strong> Our admin team will contact you shortly to arrange payment and provide additional shipping details.</p>
            </div>
            
            <p>You can track your package anytime using the tracking number above.</p>
            
            <p>Thank you for choosing Haulix for your international shipping needs!</p>
            
            <p>Best regards,<br>The Haulix Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Haulix. All rights reserved.</p>
            <p>Need help? Contact us at support@haulix.delivery</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Admin Notification Template
  adminNotification: (order) => ({
    subject: `🚨 New Order Received - ${order.trackingNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Notification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
          .order-details { background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
          .detail-item { background: white; padding: 12px; border-radius: 4px; border: 1px solid #fecaca; }
          .label { font-weight: bold; color: #7f1d1d; }
          .value { color: #374151; margin-top: 5px; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #6b7280; }
          .urgent { background: #fef2f2; border: 2px solid #fecaca; padding: 15px; border-radius: 8px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 New Order Alert</h1>
          </div>
          <div class="content">
            <div class="urgent">
              <h3 style="margin-top: 0; color: #dc2626;">⚡ Action Required</h3>
              <p>A new shipping order has been received and requires immediate attention.</p>
            </div>
            
            <div class="order-details">
              <h3>Order Information</h3>
              <div class="details-grid">
                <div class="detail-item">
                  <div class="label">Tracking Number</div>
                  <div class="value">${order.trackingNumber}</div>
                </div>
                <div class="detail-item">
                  <div class="label">Service Type</div>
                  <div class="value">${order.shippingInfo.service.charAt(0).toUpperCase() + order.shippingInfo.service.slice(1)}</div>
                </div>
                <div class="detail-item">
                  <div class="label">Customer Name</div>
                  <div class="value">${order.senderInfo.name}</div>
                </div>
                <div class="detail-item">
                  <div class="label">Customer Email</div>
                  <div class="value">${order.senderInfo.email}</div>
                </div>
                <div class="detail-item">
                  <div class="label">Customer Phone</div>
                  <div class="value">${order.senderInfo.phone}</div>
                </div>
                <div class="detail-item">
                  <div class="label">Shipping Cost</div>
                  <div class="value">$${order.shippingInfo.cost}</div>
                </div>
              </div>
              
              <h4>Package Details</h4>
              <div class="details-grid">
                <div class="detail-item">
                  <div class="label">Description</div>
                  <div class="value">${order.packageInfo.description}</div>
                </div>
                <div class="detail-item">
                  <div class="label">Weight</div>
                  <div class="value">${order.packageInfo.weight}g</div>
                </div>
                <div class="detail-item">
                  <div class="label">Value</div>
                  <div class="value">$${order.packageInfo.value}</div>
                </div>
                <div class="detail-item">
                  <div class="label">Category</div>
                  <div class="value">${order.packageInfo.category}</div>
                </div>
              </div>
              
              <h4>Delivery Information</h4>
              <div class="detail-item" style="grid-column: 1 / -1;">
                <div class="label">Destination</div>
                <div class="value">
                  ${order.recipientInfo.name}<br>
                  ${order.recipientInfo.address.street}<br>
                  ${order.recipientInfo.address.city}, ${order.recipientInfo.address.state} ${order.recipientInfo.address.zipCode}<br>
                  ${order.recipientInfo.address.country}
                </div>
              </div>
            </div>
            
            <div style="background: #dbeafe; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6; margin: 20px 0;">
              <p><strong>📋 Next Steps:</strong></p>
              <ul>
                <li>Review order details in the admin dashboard</li>
                <li>Contact customer for payment arrangement</li>
                <li>Update order status once confirmed</li>
                <li>Arrange package pickup/processing</li>
              </ul>
            </div>
            
            <p>Please process this order promptly to maintain our service standards.</p>
          </div>
          <div class="footer">
            <p>© 2024 Haulix Admin System</p>
            <p>This is an automated notification from the Haulix platform</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Status Update Template
  statusUpdate: (order, status, customerName) => {
    const statusMessages = {
      confirmed: {
        title: '✅ Order Confirmed',
        message: 'Your order has been confirmed and is being prepared for shipment.',
        color: '#3b82f6',
        bgColor: '#dbeafe',
      },
      paid: {
        title: '💳 Payment Received',
        message: 'Thank you! Payment has been received and your package is being prepared.',
        color: '#10b981',
        bgColor: '#d1fae5',
      },
      in_transit: {
        title: '🚚 Package In Transit',
        message: 'Your package is now on its way to the destination!',
        color: '#8b5cf6',
        bgColor: '#e9d5ff',
      },
      delivered: {
        title: '🎉 Package Delivered',
        message: 'Great news! Your package has been successfully delivered.',
        color: '#10b981',
        bgColor: '#d1fae5',
      },
    };

    const statusInfo = statusMessages[status] || statusMessages.confirmed;

    return {
      subject: `${statusInfo.title} - ${order.trackingNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Status Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, ${statusInfo.color}, #6366f1); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
            .status-box { background: ${statusInfo.bgColor}; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${statusInfo.color}; }
            .tracking-info { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #6b7280; }
            .track-button { display: inline-block; background: ${statusInfo.color}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }
            .highlight { color: ${statusInfo.color}; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${statusInfo.title}</h1>
            </div>
            <div class="content">
              <h2>Hi ${customerName},</h2>
              
              <div class="status-box">
                <h3 style="margin-top: 0;">Package Status Update</h3>
                <p style="font-size: 16px; margin-bottom: 0;">${statusInfo.message}</p>
              </div>
              
              <div class="tracking-info">
                <h4>Tracking Information</h4>
                <p><strong>Tracking Number:</strong> <span class="highlight">${order.trackingNumber}</span></p>
                <p><strong>Current Status:</strong> <span class="highlight">${status.replace('_', ' ').toUpperCase()}</span></p>
                <p><strong>Last Updated:</strong> ${new Date().toLocaleString()}</p>
                ${status !== 'delivered' ? `<p><strong>Estimated Delivery:</strong> ${new Date(order.shippingInfo.estimatedDelivery).toLocaleDateString()}</p>` : ''}
              </div>
              
              <p>You can track your package in real-time using the tracking number above.</p>
              
              ${status === 'delivered' ? 
                '<div style="background: #f0fdf4; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981; margin: 20px 0;"><p><strong>📦 Delivery Complete!</strong> Thank you for choosing Haulix. We hope you\'re satisfied with our service!</p></div>' : 
                '<p>We\'ll continue to keep you updated as your package makes its way to the destination.</p>'
              }
              
              <p>Thank you for choosing Haulix!</p>
              
              <p>Best regards,<br>The Haulix Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Haulix. All rights reserved.</p>
              <p>Track your package anytime at haulix.delivery</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  },

  // Password Reset Template
  passwordReset: (name, resetToken) => ({
    subject: 'Reset Your Haulix Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
          .reset-box { background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #6b7280; }
          .reset-button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>We received a request to reset your Haulix account password.</p>
            
            <div class="reset-box">
              <h3>Reset Your Password</h3>
              <p>Click the button below to reset your password. This link will expire in 1 hour for security reasons.</p>
              <a href="${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}" class="reset-button">Reset Password</a>
            </div>
            
            <p>If you didn't request this password reset, please ignore this email or contact our support team if you have concerns.</p>
            
            <p>For security reasons, this link will expire in 1 hour.</p>
            
            <p>Best regards,<br>The Haulix Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Haulix. All rights reserved.</p>
            <p>If you need help, contact us at support@haulix.delivery</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};