const RECIPIENTS = [
  'carloseber69@gmail.com',
  'eduardagabrielledosreis@gmail.com',
];

async function sendToRecipient(recipient, { subject, message, replyTo, name }) {
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      _subject: subject,
      _captcha: 'false',
      _template: 'box',
      _replyto: replyTo || recipient,
      Nome: name,
      message,
    }),
  });
  const data = await response.json().catch(() => ({}));
  return { recipient, ok: response.ok, detail: data };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subject, message, replyTo, name } = req.body || {};
    if (!subject || !message || !name) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const results = await Promise.all(
      RECIPIENTS.map(recipient => sendToRecipient(recipient, { subject, message, replyTo, name }))
    );

    const sent = results.filter(r => r.ok);
    if (sent.length === RECIPIENTS.length) {
      return res.status(200).json({ ok: true, sent: sent.map(r => r.recipient) });
    }
    if (sent.length > 0) {
      return res.status(207).json({
        ok: true,
        partial: true,
        sent: sent.map(r => r.recipient),
        failed: results.filter(r => !r.ok).map(r => r.recipient),
      });
    }

    return res.status(500).json({ error: 'Falha ao enviar e-mail', detail: results });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
