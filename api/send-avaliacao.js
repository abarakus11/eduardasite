// Token ativado em carloseber69@gmail.com (eduardasite.vercel.app)
const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/6a1542f7a87322084bdd2a67cf841073';
const CC_RECIPIENT = 'eduardagabrielledosreis@gmail.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subject, message, replyTo, name } = req.body || {};
    if (!subject || !message || !name) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const response = await fetch(FORMSUBMIT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: subject,
        _captcha: 'false',
        _template: 'box',
        _replyto: replyTo,
        _cc: CC_RECIPIENT,
        Nome: name,
        message,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === 'false') {
      return res.status(500).json({ error: 'Falha ao enviar e-mail', detail: data });
    }

    return res.status(200).json({
      ok: true,
      sent: ['carloseber69@gmail.com', CC_RECIPIENT],
    });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
