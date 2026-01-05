const express = require('express');
const { v4: uuid } = require('uuid');
const { listInvoices, getInvoiceById, createInvoice, deleteInvoice } = require('../data');
const router = express.Router();

router.post('/', (req, res) => {
	const { amount } = req.body;
	if (amount == null) return res.status(400).json({ error: 'amount is required' });
	const { customer, due_date, description } = req.body;
	const inv = { id: uuid(), amount, status: 'PENDING', customer: customer || null, due_date: due_date || null, description: description || null };
	const created = createInvoice(inv);
	res.status(201).json(created);
});

router.get('/', (req, res) => {
	const items = listInvoices();
	res.json(items);
});

router.get('/:id', (req, res) => {
	const inv = getInvoiceById(req.params.id);
	if (!inv) return res.status(404).json({ error: 'invoice not found' });
	res.json(inv);
});

router.put('/:id', (req, res) => {
	const inv = getInvoiceById(req.params.id);
	if (!inv) return res.status(404).json({ error: 'invoice not found' });
	// update fields
	const updates = {};
	if (req.body.amount != null) updates.amount = req.body.amount;
	if (req.body.status) updates.status = req.body.status;
	if (Object.keys(updates).length === 0) return res.json(inv);

	// perform update
	const db = require('../db');
	const parts = [];
	const vals = [];
	if (updates.amount != null) { parts.push('amount = ?'); vals.push(updates.amount); }
	if (updates.status) { parts.push('status = ?'); vals.push(updates.status); }
	vals.push(req.params.id);
	const stmt = db.prepare(`UPDATE invoices SET ${parts.join(', ')} WHERE id = ?`);
	stmt.run(...vals);
	const updated = getInvoiceById(req.params.id);
	res.json(updated);
});

router.delete('/:id', (req, res) => {
	const ok = deleteInvoice(req.params.id);
	if (!ok) return res.status(404).json({ error: 'invoice not found' });
	res.json({ message: 'deleted' });
});

module.exports = router;