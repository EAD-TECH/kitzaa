interface AdminInviteTemplateParams {
  firstName: string;
  role: string;
  setupLink: string; 
}

export const adminInviteTemplate = ({
  firstName,
  role,
  setupLink,
}: AdminInviteTemplateParams): string => `
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
            <td bgcolor="#6B8E70" style="background-color:#6B8E70; background-image:linear-gradient(135deg, #8BA88E 0%, #6B8E70 100%); padding:44px 32px; text-align:center;">
              <img src="${process.env.CLIENT_URL}/images/logo.png" alt="Kitzaa" width="130" style="display:block; width:130px; height:auto; margin:0 auto 16px; border:0;" />
              <h1 style="margin:0; color:#FFFFFF; font-size:24px; font-weight:700; letter-spacing:-0.3px;">
                Einladung zu Kitzaa
              </h1>
              <p style="margin:8px 0 0; color:rgba(255,255,255,0.9); font-size:14px;">
                Werde Teil unseres Teams 🌼
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 8px;">
              <p style="margin:0 0 20px; color:#4A5568; font-size:15px; line-height:1.7;">
                Hallo <strong style="color:#2D3748;">${firstName}</strong>, du wurdest von einem Administrator als <strong style="color:#2D3748;">${role}</strong> in das System eingeladen.
              </p>

              <!-- 2. DÜZELTME: Metin "Profilini tamamlamak için..." olarak güncellendi -->
              <p style="margin:0 0 24px; color:#4A5568; font-size:15px; line-height:1.7;">
                Um deinen Account zu aktivieren und dein Profil vollständig einzurichten, klicke bitte auf den folgenden Button:
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 4px;">
                    <!-- 3. DÜZELTME: Buton metni Account einrichten (Hesabı kur) oldu -->
                    <a href="${setupLink}" style="display:inline-block; padding:14px 28px; background-color:#6B8E70; color:#FFFFFF; font-size:14px; font-weight:600; text-decoration:none; border-radius:12px;">
                      Account einrichten
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0; color:#A0AEC0; font-size:13px; line-height:1.6;">
                Hinweis: Dieser Link ist aus Sicherheitsgründen 24 Stunden lang gültig.
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






