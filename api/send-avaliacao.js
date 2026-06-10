const RECIPIENT = 'carloseber69@gmail.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subject, message, replyTo, name } = req.body || {};
    if (!subject || !message || !name) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(RECIPIENT)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: subject,
        _captcha: 'false',
        _template: 'box',
        _replyto: replyTo || RECIPIENT,
        Nome: name,
        message,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(500).json({ error: 'Falha ao enviar e-mail', detail: data });
    }

    return res.status(200).json({ ok: true, detail: data });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
