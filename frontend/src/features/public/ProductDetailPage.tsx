import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProductBySlug, useProducts } from '../../hooks/useProducts';
import { useSiteContent } from '../../hooks/useSiteContent';
import { exportProductSpecPDF } from '../../utils/productSpecPdf';
import {
  ShieldCheck,
  Download,
  FileText,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Share2,
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'th';
  const { settings } = useSiteContent();

  const { data: product, isLoading } = useProductBySlug(slug, currentLang);
  const { data: allProducts } = useProducts(undefined, undefined, currentLang);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (isLoading || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-sm text-theme-text-muted">
        {t('common.loading')}
      </div>
    );
  }

  const images = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.primaryImageURL];

  const relatedProducts = (allProducts ?? [])
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16 font-sans">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => onNavigate('/products')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-theme-text-muted hover:text-theme-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{t('nav.products')}</span>
      </button>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Gallery Column */}
        <div className="space-y-4">
          <div className="aspect-square w-full overflow-hidden rounded-3xl border border-theme-border-highlight bg-theme-surface-elevated shadow-2xl relative">
            <img
              src={images[activeImageIndex] || product.primaryImageURL}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            <span className="absolute top-4 left-4 rounded-lg bg-black/75 px-3 py-1 text-xs font-mono font-bold text-theme-primary backdrop-blur-md">
              {product.sku}
            </span>
          </div>

          {/* Gallery Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-theme-primary scale-105 shadow-md'
                      : 'border-theme-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="rounded-full bg-theme-primary/15 px-3 py-1 text-xs font-bold text-theme-primary uppercase tracking-wider">
              {product.categoryName}
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-black text-theme-text leading-tight">
              {(product as any).translations?.[currentLang]?.name || (currentLang === 'en' ? (product as any).nameEn : product.name) || product.name}
            </h1>
          </div>

          <p className="text-sm text-theme-text-muted leading-relaxed">
            {(product as any).translations?.[currentLang]?.description || (currentLang === 'en' ? (product as any).descriptionEn : product.description) || product.description}
          </p>

          {/* Quick Specifications Table */}
          <div className="rounded-2xl border border-theme-border bg-theme-surface-elevated/70 p-5 space-y-3 backdrop-blur-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-primary flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              {t('products.specs')}
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="border-b border-theme-border/50 pb-2">
                <span className="text-theme-text-dim block text-[11px]">{t('products.material')}</span>
                <span className="font-semibold text-theme-text">{product.material}</span>
              </div>
              <div className="border-b border-theme-border/50 pb-2">
                <span className="text-theme-text-dim block text-[11px]">{t('products.coating')}</span>
                <span className="font-semibold text-theme-text">{product.coatingType}</span>
              </div>
              {product.specifications &&
                Object.entries(product.specifications).map(([k, v]) => (
                  <div key={k} className="border-b border-theme-border/50 pb-2">
                    <span className="text-theme-text-dim block text-[11px] capitalize">{k.replace('_', ' ')}</span>
                    <span className="font-semibold text-theme-text">{String(v)}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className="flex-1 min-w-[200px] flex items-center justify-center gap-2 rounded-xl bg-theme-primary py-3.5 px-6 text-sm font-bold text-black shadow-lg shadow-theme-primary/25 hover:bg-theme-primary-hover transition-all"
            >
              <PhoneCall className="h-4 w-4" />
              <span>{t('common.requestQuoteBtn') || t('common.requestQuote')}</span>
            </button>

            <button
              type="button"
              onClick={() => exportProductSpecPDF(product, settings)}
              className="flex items-center gap-2 rounded-xl border border-theme-border bg-theme-surface py-3.5 px-6 text-sm font-semibold text-theme-text hover:bg-theme-surface-hover hover:border-theme-primary transition-all cursor-pointer shadow-sm"
              title="เปิดและดาวน์โหลดเอกสารสเปกสินค้า (PDF)"
            >
              <Download className="h-4 w-4 text-theme-primary" />
              <span>{t('common.downloadSpec')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Applications & Features Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-theme-border">
        <div className="rounded-2xl border border-theme-border bg-theme-surface p-6 space-y-3">
          <h3 className="font-display text-base font-bold text-theme-text flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-theme-primary" />
            {t('products.applications')}
          </h3>
          <p className="text-xs text-theme-text-muted leading-relaxed">
            {product.applications}
          </p>
        </div>

        <div className="rounded-2xl border border-theme-border bg-theme-surface p-6 space-y-3">
          <h3 className="font-display text-base font-bold text-theme-text flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-theme-primary" />
            {t('products.features')}
          </h3>
          <p className="text-xs text-theme-text-muted leading-relaxed">
            {product.features}
          </p>
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-theme-border">
          <h2 className="font-display text-xl font-bold text-theme-text">
            {t('products.related')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onNavigate(`/products/${rel.slug}`)}
                className="glow-card group cursor-pointer rounded-2xl border border-theme-border bg-theme-surface p-5 transition-all"
              >
                <div className="aspect-video w-full overflow-hidden rounded-xl bg-theme-surface-elevated mb-3">
                  <img src={rel.primaryImageURL} alt={rel.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <h4 className="font-bold text-xs text-theme-text group-hover:text-theme-primary transition-colors line-clamp-1">
                  {rel.name}
                </h4>
                <p className="text-[11px] text-theme-text-muted mt-1 line-clamp-1">
                  {rel.material}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
