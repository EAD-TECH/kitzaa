interface OrganizerApplicationReceivedTemplateParams {
  username: string;
  institutionName: string;
}

export const organizerApplicationReceivedTemplate = ({
  username,
  institutionName,
}: OrganizerApplicationReceivedTemplateParams): string => `
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Organisator-Antrag eingegangen</title>
</head>
<body style="margin:0; padding:0; background-color:#F4EFE7; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4EFE7; padding:48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background-color:#FFFFFF; border-radius:28px; overflow:hidden; box-shadow:0 10px 30px rgba(194,109,77,0.12);">

          <!-- Header -->
          <tr>
            <td bgcolor="#6B8E70" style="background-color:#6B8E70; background-image:linear-gradient(135deg, #8BA88E 0%, #6B8E70 100%); padding:44px 32px; text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 16px;">
                <tr>
                  <td width="72" height="72" align="center" valign="middle" style="width:72px; height:72px; background-color:rgba(255,255,255,0.22); border-radius:50%; font-size:34px; line-height:1;">
                    📋
                  </td>
                </tr>
              </table>
              <h1 style="margin:0; color:#FFFFFF; font-size:24px; font-weight:700; letter-spacing:-0.3px;">
                Antrag eingegangen
              </h1>
              <p style="margin:8px 0 0; color:rgba(255,255,255,0.9); font-size:14px;">
                Wir haben deine Organisator-Bewerbung erhalten 🌼
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 8px;">
              <p style="margin:0 0 20px; color:#4A5568; font-size:15px; line-height:1.7;">
                Hallo <strong style="color:#2D3748;">${username}</strong>, vielen Dank für deine Bewerbung als Organisator für
                <strong style="color:#2D3748;">${institutionName}</strong>. Dein Antrag ist bei uns eingegangen und wird von unserem Team geprüft.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:14px 18px; background-color:#F9F6F1; border-left:4px solid #E8C16C; border-radius:12px;">
                    <p style="margin:0; color:#4A5568; font-size:13px; line-height:1.6;">
                      ⏱️ Nach der Prüfung informieren wir dich per E-Mail über das Ergebnis — unabhängig davon, ob dein Antrag genehmigt oder abgelehnt wird.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0 0; color:#4A5568; font-size:14px; line-height:1.7;">
                Du musst nichts weiter tun. Wir melden uns, sobald die Prüfung abgeschlossen ist.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px 32px; text-align:center;">
              <p style="margin:0 0 4px; color:#A0AEC0; font-size:12px;">
                Danke, dass du Kitzaa mitgestalten möchtest 🌼
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
