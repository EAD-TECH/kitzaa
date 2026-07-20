export const welcomeTemplate = (name: string, confirmUrl: string = "https://kitzaa.de/confirm") => `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Willkommen bei Kitzaa</title>
</head>
<body style="margin:0; padding:0; background-color:#f7f9fc; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f7f9fc; padding: 20px 0;">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #ff8a65 0%, #ff6b81 100%); padding: 32px 20px; color:#ffffff;">
                            <h1 style="margin:0; font-size:32px; font-weight:800; letter-spacing:-1px;">Kitzaa 🎉</h1>
                            <p style="margin:6px 0 0 0; font-size:15px; opacity:0.95; font-weight:500;">Das Familien- & Event-Portal</p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 32px 36px; color:#334155;">
                            <h2 style="color:#1e293b; margin-top:0; font-size:22px; font-weight:700;">Herzlich willkommen, ${name}! 🎈</h2>
                            <p style="font-size:15px; line-height:1.6; color:#475569; margin-bottom:20px;">
                                Schön, dass du da bist! Wir freuen uns riesig, dich und deine Familie in der Kitzaa-Community begrüßen zu dürfen.
                            </p>
                            <p style="font-size:15px; line-height:1.6; color:#475569; margin-bottom:24px;">
                                Entdecke jetzt tolle Familien-Events, kreative Workshops und unvergessliche Erlebnisse in deiner Nähe.
                            </p>
                            
                            <!-- Highlight Box -->
                            <div style="background-color:#fff7ed; border-left:4px solid #ff8a65; padding:16px 20px; border-radius:12px; margin:24px 0;">
                                <strong style="color:#c2410c; font-size:15px; display:block; margin-bottom:8px;">Deine Vorteile bei Kitzaa:</strong>
                                <ul style="margin:0; padding-left:20px; color:#57534e; font-size:14px; line-height:1.6;">
                                    <li style="margin-bottom:6px;">Exklusive Events & Workshops direkt in deiner Nähe</li>
                                    <li style="margin-bottom:6px;">Einfache Online-Anmeldung & Ticket-Buchung</li>
                                    <li>Lieblings-Events auf der Merkliste speichern</li>
                                </ul>
                            </div>

                            <p style="font-size:14px; color:#64748b; margin-top:24px;">
                                Bitte klicke auf den Button unten, um deine E-Mail-Adresse zu bestätigen:
                            </p>

                            <!-- Button -->
                            <div style="text-align:center; margin:32px 0;">
                                <a href="${confirmUrl}" style="background:linear-gradient(135deg, #ff6b81 0%, #ff8a65 100%); color:#ffffff; text-decoration:none; padding:14px 36px; border-radius:50px; font-weight:bold; font-size:15px; display:inline-block; box-shadow:0 4px 14px rgba(255, 107, 129, 0.4);">Registrierung bestätigen ✨</a>
                            </div>

                            <p style="font-size:12px; color:#94a3b8; text-align:center; margin-top:20px; word-break:break-all;">
                                Falls der Button nicht klickbar ist, nutze diesen Link:<br>
                                <a href="${confirmUrl}" style="color:#64748b;">${confirmUrl}</a>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color:#f8fafc; padding:24px; border-top:1px solid #f1f5f9; color:#94a3b8; font-size:12px;">
                            <p style="margin:0 0 6px 0; color:#475569; font-size:13px;">Liebe Grüße,<br><strong>Dein Kitzaa-Team ❤️</strong></p>
                            <p style="margin:0;">© Kitzaa • Alle Rechte vorbehalten</p>
                            <p style="margin:6px 0 0 0; font-size:12px; color:#64748b;">
                                🌐 <a href="https://kitzaa.de" style="color:#64748b; text-decoration:none;">kitzaa.de</a> &nbsp;•&nbsp; ✉️ hallo@kitzaa.de
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