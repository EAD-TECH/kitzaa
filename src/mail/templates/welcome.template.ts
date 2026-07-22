interface WelcomeTemplateParams {
  username: string;
  loginUrl?: string;
}

export const welcomeTemplate = ({ username, loginUrl = 'https://kitzaa.de/login' }: WelcomeTemplateParams): string => `
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Willkommen bei Kitzaa</title>
</head>
<body style="margin:0; padding:0; background-color:#F4EFE7; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4EFE7; padding:48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background-color:#FFFFFF; border-radius:28px; overflow:hidden; box-shadow:0 10px 30px rgba(194,109,77,0.12);">

          <!-- Header -->
          <tr>
            <td bgcolor="#C26D4D" style="background-color:#C26D4D; background-image:linear-gradient(135deg, #E8C16C 0%, #C26D4D 100%); padding:44px 32px; text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 16px;">
                <tr>
                  <td width="72" height="72" align="center" valign="middle" style="width:72px; height:72px; background-color:rgba(255,255,255,0.22); border-radius:50%; font-size:34px; line-height:1;">
                    🦌
                  </td>
                </tr>
              </table>
              <h1 style="margin:0; color:#FFFFFF; font-size:24px; font-weight:700; letter-spacing:-0.3px;">
                Willkommen, ${username}!
              </h1>
              <p style="margin:8px 0 0; color:rgba(255,255,255,0.9); font-size:14px;">
                Schön, dass du bei Kitzaa dabei bist 🌼
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 8px;">
              <p style="margin:0 0 20px; color:#4A5568; font-size:15px; line-height:1.7;">
                Hallo <strong style="color:#2D3748;">${username}</strong>, dein Konto ist startklar! Ab jetzt findest du kinderfreundliche Events in deiner Nähe und kannst dich im Familienforum mit anderen Eltern austauschen.
              </p>

              <!-- Feature list -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:14px 16px; background-color:#F9F6F1; border-radius:16px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="40" style="font-size:20px; vertical-align:top; padding:6px 0;">🎪</td>
                        <td style="color:#2D3748; font-size:14px; line-height:1.6; padding:6px 0;">Kinderfreundliche Events entdecken &amp; buchen</td>
                      </tr>
                      <tr>
                        <td width="40" style="font-size:20px; vertical-align:top; padding:6px 0;">💬</td>
                        <td style="color:#2D3748; font-size:14px; line-height:1.6; padding:6px 0;">Im Familienforum austauschen &amp; Fragen stellen</td>
                      </tr>
                      <tr>
                        <td width="40" style="font-size:20px; vertical-align:top; padding:6px 0;">👨‍👩‍👧‍👦</td>
                        <td style="color:#2D3748; font-size:14px; line-height:1.6; padding:6px 0;">Andere Familien aus deiner Umgebung kennenlernen</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:32px auto 8px;">
                <tr>
                  <td align="center" style="border-radius:999px; background-color:#8BA88E;">
                    <a href="${loginUrl}" target="_blank" style="display:inline-block; padding:15px 40px; color:#FFFFFF; font-size:15px; font-weight:600; text-decoration:none; border-radius:999px;">
                      Jetzt loslegen →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px 32px; text-align:center;">
              <p style="margin:0 0 4px; color:#A0AEC0; font-size:12px;">
                Wir freuen uns auf dich und deine Familie 🌼
              </p>
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
