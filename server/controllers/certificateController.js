const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailer');

const generateCertificate = async (req, res) => {
  try {
    const { user: userId, event, volunteerName, eventName, eventDate, type, description } = req.body;

    const certificateId = `CERT-${uuidv4().slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    const certificate = await Certificate.create({
      user: userId,
      event: event || undefined,
      certificateId,
      volunteerName,
      eventName,
      eventDate: new Date(eventDate),
      type: type || 'volunteer',
      description: description || '',
      generatedBy: req.user._id
    });

    const user = await User.findById(userId);
    if (user) {
      certificate.volunteerName = user.name;
      await certificate.save();
    }

    res.status(201).json({
      success: true,
      message: 'Certificate generated',
      data: certificate
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCertificates = async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const query = {};

    if (type) query.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Certificate.countDocuments(query);

    const certificates = await Certificate.find(query)
      .populate('user', 'name email')
      .populate('generatedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: certificates,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.user._id })
      .sort({ issueDate: -1 });

    res.json({
      success: true,
      data: certificates
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const downloadCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('user', 'name email');

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    const allowedRoles = ['admin'];
    if (req.user.role === 'volunteer' || req.user.role === 'intern') {
      if (certificate.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4'
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${certificate.certificateId}.pdf`);

    doc.pipe(res);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    doc.rect(0, 0, pageWidth, pageHeight).fill('#f5f0e8');

    doc.rect(30, 30, pageWidth - 60, pageHeight - 60).lineWidth(3).stroke('#8B4513');

    doc.rect(40, 40, pageWidth - 80, pageHeight - 80).lineWidth(1).stroke('#D4A574');

    doc.fontSize(36).font('Helvetica-Bold').fillColor('#2c3e50')
      .text('NayePankh', { align: 'center' });

    doc.fontSize(14).font('Helvetica').fillColor('#7f8c8d')
      .text('Empowering Communities, Transforming Lives', { align: 'center' });

    doc.moveDown(2);

    doc.fontSize(20).font('Helvetica-Bold').fillColor('#2c3e50')
      .text('Certificate of Appreciation', { align: 'center' });

    doc.moveDown(1.5);

    doc.fontSize(14).font('Helvetica').fillColor('#34495e')
      .text('This certificate is proudly presented to', { align: 'center' });

    doc.moveDown(0.5);

    doc.fontSize(28).font('Helvetica-BoldOblique').fillColor('#8B4513')
      .text(certificate.volunteerName, { align: 'center' });

    doc.moveDown(1);

    doc.fontSize(14).font('Helvetica').fillColor('#34495e')
      .text(`For their valuable contribution as a ${certificate.type}`, { align: 'center' });

    doc.moveDown(0.5);

    doc.fontSize(14).font('Helvetica').fillColor('#2c3e50')
      .text(`Event: ${certificate.eventName}`, { align: 'center' });

    doc.moveDown(0.5);

    doc.fontSize(12).font('Helvetica').fillColor('#7f8c8d')
      .text(`Date: ${new Date(certificate.eventDate).toLocaleDateString()}`, { align: 'center' });

    doc.moveDown(2);

    const midY = doc.y;
    doc.fontSize(10).font('Helvetica').fillColor('#95a5a6')
      .text(`Certificate ID: ${certificate.certificateId}`, 60, pageHeight - 80);
    doc.text(`Issue Date: ${new Date(certificate.issueDate).toLocaleDateString()}`, 60, pageHeight - 65);

    doc.fontSize(10).font('Helvetica').fillColor('#7f8c8d')
      .text(`Generated by: ${req.user.name}`, pageWidth - 250, pageHeight - 80);

    doc.end();

    certificate.pdfUrl = `/uploads/certificates/${certificate.certificateId}.pdf`;
    await certificate.save();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const sendCertificateEmail = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('user', 'name email');

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    await sendEmail({
      email: certificate.user.email,
      subject: 'Your Certificate - NayePankh',
      html: `
        <h2>Congratulations ${certificate.volunteerName}!</h2>
        <p>Your certificate for <strong>${certificate.eventName}</strong> has been generated.</p>
        <p><strong>Certificate ID:</strong> ${certificate.certificateId}</p>
        <p>You can download your certificate from your dashboard.</p>
        <br/>
        <p>Thank you for your contribution!</p>
        <p>- NayePankh Team</p>
      `
    });

    certificate.sentViaEmail = true;
    await certificate.save();

    res.json({
      success: true,
      message: 'Certificate sent via email'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  generateCertificate,
  getCertificates,
  getMyCertificates,
  downloadCertificate,
  sendCertificateEmail
};
