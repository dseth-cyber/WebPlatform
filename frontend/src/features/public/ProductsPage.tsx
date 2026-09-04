import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useProducts, useCategories } from '../../hooks/useProducts';
import { SearchableSelect, SelectOption } from '../../components/ui/SearchableSelect';
import { Search, ArrowRight, Download, SlidersHorizontal, Package, Plus, Settings } from 'lucide-react';

export const ProductsPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'th';

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    try {
      const param = new URLSearchParams(window.location.search).get('category');
      return param || 'all';
    } catch (e) {
      return 'all';
    }
  });

  useEffect(() => {
    try {
      const param = new URLSearchParams(window.location.search).get('category');
      if (param) {
        setSelectedCategory(param);
      }
    } catch (e) {}
  }, []);

  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data: categories } = useCategories(currentLang);
  const { data: products, isLoading } = useProducts(selectedCategory, searchTerm, currentLang);

  const categoryOptions: SelectOption[] = [
    { value: 'all', label: `✨ ${t('common.all')} (${t('common.categories')})` },
    ...(categories ?? []).map((cat) => ({
      value: cat.id,
      label: cat.name,
    })),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-16 sm:px-6 lg:px-8 space-y-10 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-theme-primary">
            Packaging Catalog
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-theme-text">
            {t('products.title')}
          </h1>
          <p className="text-sm text-theme-text-muted max-w-2xl">
            {t('products.subtitle')}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="relative z-20 rounded-2xl border border-theme-border bg-theme-surface-elevated/70 p-4 backdrop-blur-md shadow-glass-edge flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category Filter Dropdown using SearchableSelect */}
        <div className="relative z-30 w-full md:w-80">
          <label className="text-[10px] font-bold uppercase tracking-wider text-theme-text-dim block mb-1">
            {t('products.filterCategory')}
          </label>
          <SearchableSelect
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder={t('products.filterCategory')}
          />
        </div>

        {/* Live Search Input */}
        <div className="w-full md:w-96">
          <label className="text-[10px] font-bold uppercase tracking-wider text-theme-text-dim block mb-1">
            {t('common.search')}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-theme-text-dim" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('products.searchPlaceholder')}
              className="w-full rounded-lg border border-theme-border bg-theme-surface py-2.5 pl-9 pr-3 text-xs text-theme-text placeholder-theme-text-dim focus:border-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-primary"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="relative z-10">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-96 rounded-2xl bg-theme-surface animate-pulse border border-theme-border" />
          ))}
        </div>
      ) : (products ?? []).length === 0 ? (
        <div className="rounded-2xl border border-dashed border-theme-border p-12 text-center text-theme-text-muted space-y-2">
          <Package className="h-10 w-10 mx-auto text-theme-text-dim" />
          <p className="text-sm font-semibold">{t('common.emptyState')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(products ?? []).map((product) => (
            <div
              key={product.id}
              onClick={() => onNavigate(`/products/${product.slug}`)}
              className="glow-card group cursor-pointer rounded-2xl border border-theme-border bg-theme-surface p-6 shadow-glass-edge flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="aspect-video w-full overflow-hidden rounded-xl bg-theme-surface-elevated relative">
                  <img
                    src={product.primaryImageURL}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 rounded-md bg-black/75 px-2.5 py-1 text-xs font-mono font-bold text-theme-primary backdrop-blur-md">
                    {product.sku}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-theme-primary">
                    {product.categoryName}
                  </span>
                  <h3 className="font-display text-base font-bold text-theme-text group-hover:text-theme-primary transition-colors line-clamp-2 mt-0.5">
                    {product.name}
                  </h3>
                </div>

                <p className="text-xs text-theme-text-muted line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                {/* Technical Specifications Quick Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="rounded-md border border-theme-border bg-theme-surface-elevated px-2 py-1 text-[11px] font-mono text-theme-text-muted">
                    {(product.material || 'ETP').split(' ')[0]}
                  </span>
                  <span className="rounded-md border border-theme-border bg-theme-surface-elevated px-2 py-1 text-[11px] font-mono text-theme-text-muted">
                    {(product.coatingType || 'BPA-NI').split(' ')[0]}
                  </span>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-theme-border flex items-center justify-between text-xs">
                <span className="font-semibold text-theme-text group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
                  {t('common.viewDetails')}
                  <ArrowRight className="h-4 w-4 text-theme-primary" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};
