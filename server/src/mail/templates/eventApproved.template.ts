interface EventApprovedTemplateParams {
  username: string;
  eventTitle: string;
  eventSlug: string;
}

export const eventApprovedTemplate = ({
  username,
  eventTitle,
  eventSlug,
}: EventApprovedTemplateParams): string => `
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Event genehmigt</title>
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
                Event genehmigt
              </h1>
              <p style="margin:8px 0 0; color:rgba(255,255,255,0.9); font-size:14px;">
                Dein Event ist jetzt live auf Kitzaa 🌼
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 8px;">
              <p style="margin:0 0 20px; color:#4A5568; font-size:15px; line-height:1.7;">
                Hallo <strong style="color:#2D3748;">${username}</strong>, gute Nachrichten!
                Dein Event <strong style="color:#2D3748;">${eventTitle}</strong> wurde geprüft und genehmigt.
                Es ist ab sofort für alle sichtbar.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 4px;">
                    <a href="${process.env.CLIENT_URL}/events/${eventSlug}" style="display:inline-block; padding:14px 28px; background-color:#6B8E70; color:#FFFFFF; font-size:14px; font-weight:600; text-decoration:none; border-radius:12px;">
                      Event ansehen
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0; color:#4A5568; font-size:14px; line-height:1.7;">
                Wir freuen uns darauf, dein Event gemeinsam mit dir sichtbar zu machen.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px 32px; text-align:center;">
              <p style="margin:0 0 4px; color:#A0AEC0; font-size:12px;">
                Schön, dass du dabei bist 🌼
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
