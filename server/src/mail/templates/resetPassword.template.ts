interface ResetPasswordTemplateParams {
  username: string;
  resetUrl: string;
  expiresInMinutes?: number;
}

export const resetPasswordTemplate = ({
  username,
  resetUrl,
  expiresInMinutes = 30,
}: ResetPasswordTemplateParams): string => `
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Passwort zurücksetzen</title>
</head>
<body style="margin:0; padding:0; background-color:#F4EFE7; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4EFE7; padding:48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background-color:#FFFFFF; border-radius:28px; overflow:hidden; box-shadow:0 10px 30px rgba(194,109,77,0.12);">

          <!-- Header -->
          <tr>
            <td bgcolor="#6B8E70" style="background-color:#6B8E70; background-image:linear-gradient(135deg, #8BA88E 0%, #6B8E70 100%); padding:44px 32px; text-align:center;">
              <img src="${process.env.CLIENT_URL}/images/logo.png" alt="Kitzaa" width="130" style="display:block; width:130px; height:auto; margin:0 auto 16px; border:0;" />
              <h1 style="margin:0; color:#FFFFFF; font-size:24px; font-weight:700; letter-spacing:-0.3px;">
                Passwort zurücksetzen
              </h1>
              <p style="margin:8px 0 0; color:rgba(255,255,255,0.9); font-size:14px;">
                Kein Problem, das passiert den Besten 🌼
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 8px;">
              <p style="margin:0 0 20px; color:#4A5568; font-size:15px; line-height:1.7;">
                Hallo <strong style="color:#2D3748;">${username}</strong>, wir haben eine Anfrage erhalten, um das Passwort deines Kitzaa-Kontos zurückzusetzen. Klicke auf den Button unten, um ein neues Passwort zu vergeben.
              </p>

              <!-- CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px auto 24px;">
                <tr>
                  <td align="center" style="border-radius:999px; background-color:#C26D4D;">
                    <a href="${resetUrl}" target="_blank" style="display:inline-block; padding:15px 40px; color:#FFFFFF; font-size:15px; font-weight:600; text-decoration:none; border-radius:999px;">
                      Neues Passwort vergeben
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry notice -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:14px 18px; background-color:#F9F6F1; border-left:4px solid #E8C16C; border-radius:12px;">
                    <p style="margin:0; color:#4A5568; font-size:13px; line-height:1.6;">
                      ⏱️ Dieser Link ist nur <strong>${expiresInMinutes} Minuten</strong> gültig. War das nicht du? Dann kannst du diese E-Mail einfach ignorieren — dein Passwort bleibt unverändert.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0 0; color:#A0AEC0; font-size:12px; line-height:1.6;">
                Falls der Button nicht funktioniert, kopiere diesen Link in deinen Browser:<br />
                <a href="${resetUrl}" style="color:#8BA88E; word-break:break-all;">${resetUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px 32px; text-align:center;">
              <p style="margin:0; color:#CBD5E0; font-size:11px;">
                Fragen? Schreib uns an <a href="mailto:support@kitzaa.de" style="color:#8BA88E; text-decoration:underline;">support@kitzaa.de</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
