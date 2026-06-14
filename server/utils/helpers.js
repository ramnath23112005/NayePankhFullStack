const { v4: uuidv4 } = require('uuid');

function generateCertificateId() {
  return 'CERT-' + uuidv4().split('-')[0];
}

function paginate(page = 1, limit = 10) {
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Math.min(100, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  return { skip, limit: limitNum, page: pageNum };
}

function toCSV(data, fields) {
  if (!data || !data.length) {
    return '';
  }

  const header = fields.map(f => `"${f}"`).join(',');

  const rows = data.map(item => {
    return fields.map(f => {
      const value = item[f];
      if (value === null || value === undefined) {
        return '""';
      }
      const str = String(value).replace(/"/g, '""');
      return `"${str}"`;
    }).join(',');
  });

  return [header, ...rows].join('\r\n');
}

module.exports = {
  generateCertificateId,
  paginate,
  toCSV
};
