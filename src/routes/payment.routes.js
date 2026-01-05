const express = require('express');
const { getInvoiceById, addPayment } = require('../data');
const { v4: uuid } = require('uuid');
const router = express.Router();

router.post('/', (req, res) => {
	const { invoiceId, card } = req.body;
	if (!invoiceId) return res.status(400).json({ error: 'invoiceId is required' });
	const inv = getInvoiceById(invoiceId);
	if (!inv) return res.status(404).json({ error: 'invoice not found' });
	if (inv.status === 'PAID') return res.status(400).json({ error: 'invoice already paid' });
	// validate minimal card fields (if present)
	if (!card || !card.number) return res.status(400).json({ error: 'card.number is required' });
	const raw = String(card.number).replace(/\s+/g, '');
	if (!/^\d{12,19}$/.test(raw)) return res.status(400).json({ error: 'card number must be 12-19 digits' });
	if (card.cvc && !/^\d{3,4}$/.test(String(card.cvc))) return res.status(400).json({ error: 'cvc must be 3 or 4 digits' });
	if (card.expiry && !/^\d{2}\/\d{2}$/.test(card.expiry)) return res.status(400).json({ error: 'expiry must be MM/YY' });

	// mark invoice paid
	const db = require('../db');
	const upd = db.prepare('UPDATE invoices SET status = ? WHERE id = ?');
	upd.run('PAID', invoiceId);

	// mask card data and store only allowed fields
	const last4 = raw.slice(-4);
	const cardInfo = { last4, name: card.name || null, expiry: card.expiry || null };

	const payment = {
		id: uuid(),
		invoiceId,
		amount: inv.amount,
		status: 'SUCCESS',
		date: new Date().toISOString(),
		card: cardInfo,
	};
	addPayment(payment);
	const updatedInv = getInvoiceById(invoiceId);
	res.json({ invoice: updatedInv, payment });
});

module.exports = router;