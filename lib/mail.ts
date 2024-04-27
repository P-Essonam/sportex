import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const domain = process.env.NEXT_PUBLIC_APP_URL

export const sendTwoFactorTokenEmail = async(
    email: string,
    token: string
) => {
    const { error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Two Factor Authentication",
        html: `<!DOCTYPE html>
        <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Email Template</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
              <div style="text-align: center;">
                  <h1 style="margin-bottom: 20px;">Please copy your OTP code below.</h1>
                  <div style="display: inline-block;">
                      <h1 style="text-decoration: none;">
                          <p style="background-color: #4a90e2; color: #ffffff; padding: 10px 20px; border-radius: 5px; border: none; transition: background-color 0.3s ease-in-out;">
                            ${token}
                          </p>
                      </h1>
                  </div>
              </div>
          </body>
        </html>`
      });
  
      if (error) {
        console.log("RESEND_ERROR",error)
      }
}


export const sendPasswordResetToken = async(
  email: string,
  token: string
) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `<!DOCTYPE html>
    <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
          <div style="text-align: center;">
              <h1 style="margin-bottom: 20px;">Please click on the button below to reset your password.</h1>
              <div style="display: inline-block;">
                  <a href="${resetLink}" style="text-decoration: none;">
                      <button style="background-color: #4a90e2; color: #ffffff; padding: 10px 20px; border-radius: 5px; border: none; cursor: pointer; transition: background-color 0.3s ease-in-out;">
                        Reset your password
                      </button>
                  </a>
              </div>
          </div>
      </body>
    </html>`
  });
}