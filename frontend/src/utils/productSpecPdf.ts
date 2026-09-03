import { LocalizedProduct } from '../types/domain';
import { SiteContentSettings, DEFAULT_SITE_SETTINGS } from '../hooks/useSiteContent';

/**
 * Generates an official, print-ready Corporate Technical Specification Sheet (PDF/Print)
 * Perfectly sized for A4 portrait without edge clipping or overflow.
 */
export const exportProductSpecPDF = (
  product: LocalizedProduct,
  settings: SiteContentSettings = DEFAULT_SITE_SETTINGS
) => {
  const companyTh = settings.companyNameTh || 'บริษัท โลหะกิจรุ่งเจริญทรัพย์ จำกัด';
  const companyEn = settings.companyNameEn || 'LOHAKIT RUNGCHAROENSAP CO., LTD.';
  const phone = settings.phoneNumber || '034-875-555';
  const email = settings.email || 'info@lohakit.co.th';
  const address = settings.factoryAddress || '77 หมู่ 2 ถนนพระราม 2 ต.อ้อมน้อย อ.กระทุ่มแบน จ.สมุทรสาคร 74130';
  const logoUrl = settings.logoImage || '';

  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const specRows = product.specifications
    ? Object.entries(product.specifications)
        .map(
          ([key, value]) => `
          <tr>
            <td style="padding: 8px 12px; font-weight: 600; color: #475569; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; width: 38%; text-transform: capitalize; word-break: break-word;">
              ${key.replace(/_/g, ' ')}
            </td>
            <td style="padding: 8px 12px; color: #0f172a; font-weight: 500; border-bottom: 1px solid #e2e8f0; word-break: break-word;">
              ${String(value)}
            </td>
          </tr>`
        )
        .join('')
    : `<tr><td colspan="2" style="padding: 12px; text-align: center; color: #94a3b8;">ไม่มีข้อมูลจำเพาะเพิ่มเติม</td></tr>`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SPEC-${product.sku} - ${product.name} | ${companyEn}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Kanit', 'Inter', sans-serif;
      color: #0f172a;
      background-color: #cbd5e1;
      line-height: 1.45;
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .toolbar {
      width: 100%;
      max-width: 780px;
      background: #090e17;
      color: #ffffff;
      padding: 10px 18px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 10px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.15);
    }
    .btn-action {
      background: #0284c7;
      color: #ffffff;
      border: none;
      padding: 7px 16px;
      font-size: 12.5px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: inherit;
      transition: all 0.15s ease;
    }
    .btn-action:hover {
      background: #0369a1;
      transform: translateY(-1px);
    }
    .btn-close {
      background: #334155;
      color: #e2e8f0;
    }
    .btn-close:hover {
      background: #475569;
    }
    .sheet-wrapper {
      width: 100%;
      max-width: 780px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      box-shadow: 0 8px 24px -4px rgba(0,0,0,0.12);
      box-sizing: border-box;
    }
    .content-padding {
      padding: 28px 30px;
      box-sizing: border-box;
      width: 100%;
    }
    .header-band {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 16px;
      margin-bottom: 20px;
      gap: 16px;
      width: 100%;
    }
    .header-left {
      flex: 1 1 auto;
      min-width: 0;
    }
    .header-right {
      flex: 0 0 auto;
      text-align: right;
      white-space: nowrap;
    }
    .company-logo {
      max-height: 48px;
      max-width: 170px;
      object-fit: contain;
      margin-bottom: 4px;
    }
    .doc-badge {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      color: #0369a1;
      font-size: 10.5px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      display: inline-block;
      margin-bottom: 4px;
    }
    .product-grid {
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 20px;
      margin-bottom: 22px;
      align-items: stretch;
    }
    .image-box {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 210px;
    }
    .image-box img {
      max-width: 100%;
      max-height: 200px;
      object-fit: contain;
    }
    .quick-meta-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 8px;
    }
    .meta-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 12px;
    }
    .meta-label {
      font-size: 10.5px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
    }
    .meta-val {
      font-size: 12.5px;
      color: #0f172a;
      font-weight: 600;
    }
    .section-title {
      font-size: 13px;
      font-weight: 700;
      color: #0284c7;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 5px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11.5px;
      margin-bottom: 20px;
      table-layout: fixed;
    }
    .compliance-bar {
      background: #0f172a;
      color: #ffffff;
      border-radius: 6px;
      padding: 10px 14px;
      font-size: 10.5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 20px;
    }
    .footer-note {
      font-size: 9.5px;
      color: #64748b;
      text-align: center;
      margin-top: 16px;
      border-top: 1px dashed #cbd5e1;
      padding-top: 10px;
      line-height: 1.5;
      word-break: break-word;
    }

    @media print {
      @page {
        size: A4 portrait;
        margin: 10mm 10mm 10mm 10mm;
      }
      html, body {
        background: #ffffff !important;
        padding: 0 !important;
        margin: 0 !important;
        width: 100% !important;
      }
      .toolbar {
        display: none !important;
      }
      .sheet-wrapper {
        border: none !important;
        box-shadow: none !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        border-radius: 0 !important;
      }
      .content-padding {
        padding: 0 !important;
        width: 100% !important;
      }
      .product-grid {
        grid-template-columns: 240px 1fr !important;
        gap: 16px !important;
      }
    }
  </style>
</head>
<body>

  <div class="toolbar no-print">
    <div style="font-weight: 600; font-size: 13px; display: flex; align-items: center; gap: 8px;">
      <span>📄 เอกสารข้อมูลทางเทคนิค (Technical Specification Sheet)</span>
    </div>
    <div style="display: flex; gap: 8px;">
      <button class="btn-action" onclick="window.print()">
        🖨️ พิมพ์ / บันทึกเป็น PDF (Print & Save PDF)
      </button>
      <button class="btn-action btn-close" onclick="window.close()">
        ✕ ปิดหน้าต่าง
      </button>
    </div>
  </div>

  <div class="sheet-wrapper">
    <div class="content-padding">
      <!-- Corporate Header -->
      <div class="header-band">
        <div class="header-left">
          ${
            logoUrl
              ? `<img src="${logoUrl}" alt="Logo" class="company-logo" />`
              : `<div style="font-size: 20px; font-weight: 900; color: #0284c7; letter-spacing: -0.5px; margin-bottom: 2px;">${settings.logoText || 'LC'}</div>`
          }
          <div style="font-size: 14.5px; font-weight: 700; color: #0f172a; line-height: 1.3;">${companyTh}</div>
          <div style="font-size: 11px; font-weight: 600; color: #64748b; letter-spacing: 0.3px;">${companyEn}</div>
          <div style="font-size: 10px; color: #475569; margin-top: 4px; line-height: 1.45; word-break: break-word;">
            <div>${address}</div>
            <div style="color: #64748b; margin-top: 1px;">โทร: ${phone} | อีเมล: ${email}</div>
          </div>
        </div>
        <div class="header-right">
          <span class="doc-badge">Official Specification</span>
          <div style="font-size: 13.5px; font-weight: 700; color: #0f172a; margin-top: 2px;">SKU: ${product.sku}</div>
          <div style="font-size: 10px; color: #64748b; margin-top: 1px;">วันที่ออกเอกสาร: ${currentDate}</div>
        </div>
      </div>

      <!-- Product Title & Overview -->
      <div style="margin-bottom: 18px;">
        <div style="font-size: 10.5px; font-weight: 700; color: #0284c7; text-transform: uppercase; letter-spacing: 0.5px;">
          ${product.categoryName || 'บรรจุภัณฑ์โลหะ'}
        </div>
        <h1 style="font-size: 19px; font-weight: 800; color: #0f172a; margin-top: 2px; line-height: 1.3;">
          ${product.name}
        </h1>
        <p style="font-size: 11.5px; color: #475569; margin-top: 4px; line-height: 1.5;">
          ${product.description}
        </p>
      </div>

      <!-- Visual & Quick Details -->
      <div class="product-grid">
        <div class="image-box">
          <img src="${product.primaryImageURL}" alt="${product.name}" />
        </div>
        <div class="quick-meta-box">
          <div class="meta-card">
            <div class="meta-label">วัสดุหลัก (Primary Material)</div>
            <div class="meta-val">${product.material || 'Tinplate ETP (Electrolytic Tinplate)'}</div>
          </div>
          <div class="meta-card">
            <div class="meta-label">ระบบเคลือบผิว (Coating & Lacquer)</div>
            <div class="meta-val">${product.coatingType || 'BPA-NI Food Grade Lacquer'}</div>
          </div>
          ${
            product.unRating
              ? `
          <div class="meta-card">
            <div class="meta-label">มาตรฐานความปลอดภัย UN (UN Rating)</div>
            <div class="meta-val">${product.unRating}</div>
          </div>`
              : ''
          }
          <div class="meta-card">
            <div class="meta-label">มาตรฐานการผลิต (Standards)</div>
            <div class="meta-val">ISO 9001:2015 / FSSC 22000 / HACCP</div>
          </div>
        </div>
      </div>

      <!-- Technical Specifications Table -->
      <div class="section-title">
        ⚙️ ข้อมูลจำเพาะทางเทคนิค (Technical Specifications)
      </div>
      <table>
        <tbody>
          ${specRows}
        </tbody>
      </table>

      <!-- Applications and Features -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px;">
          <div style="font-size: 11px; font-weight: 700; color: #0284c7; margin-bottom: 3px;">
            ✓ การใช้งานที่เหมาะสม (Applications)
          </div>
          <p style="font-size: 10.5px; color: #475569; line-height: 1.5;">
            ${product.applications || 'เหมาะสำหรับอาหารสำเร็จรูป ผลไม้กระป๋อง ปลากระป๋อง และอาหารแปรรูป'}
          </p>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px;">
          <div style="font-size: 11px; font-weight: 700; color: #0284c7; margin-bottom: 3px;">
            ★ คุณสมบัติเด่น (Key Features)
          </div>
          <p style="font-size: 10.5px; color: #475569; line-height: 1.5;">
            ${product.features || 'ทนต่อแรงดันและความร้อน ป้องกันแสงและออกซิเจน 100% ปลอดสารก่อมะเร็ง'}
          </p>
        </div>
      </div>

      <!-- Compliance & Certification Bar -->
      <div class="compliance-bar">
        <div>
          <strong>การรับรอง:</strong> ISO 9001:2015 | FSSC 22000 | HACCP & GMP Certified
        </div>
        <div>
          BPA-NI Food Contact Compliant • 100% Recyclable Steel
        </div>
      </div>

      <!-- Footer Note -->
      <div class="footer-note">
        เอกสารนี้จัดทำโดยระบบอัตโนมัติของ ${companyTh} เพื่อเป็นข้อมูลประกอบการจัดซื้อและพิจารณาสเปกสินค้า | ติดต่อฝ่ายขายเพื่อขอใบเสนอราคา: ${phone} หรือ ${email}
      </div>
    </div>
  </div>

  <script>
    window.addEventListener('load', function() {
      // Trigger print after brief pause to allow fonts and images to settle
      setTimeout(function() {
        window.print();
      }, 400);
    });
  </script>
</body>
</html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } else {
    // Fallback if popups blocked: trigger blob download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SPEC-${product.sku}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }
};
