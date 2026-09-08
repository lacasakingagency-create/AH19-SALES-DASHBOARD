import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Package,
  Search,
  Plus,
  ArrowUpDown,
  Tag,
  DollarSign,
  TrendingUp,
  Edit2,
  Trash2,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import { ProductItem } from '../types';

export const ProductsPage: React.FC = () => {
  const {
    products,
    formatCurrency,
    setProductModalOpen,
    setProductToEdit,
    triggerDeleteConfirm,
    deleteProduct,
    setSelectedProduct,
    t,
  } = useApp();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'sales' | 'profit' | 'price' | 'stock'>('profit');
  const [sortAsc, setSortAsc] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesQuery =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase());
        const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
        return matchesQuery && matchesCat;
      })
      .sort((a, b) => {
        if (sortBy === 'sales') return sortAsc ? a.unitsSold - b.unitsSold : b.unitsSold - a.unitsSold;
        if (sortBy === 'price') return sortAsc ? a.price - b.price : b.price - a.price;
        if (sortBy === 'stock') return sortAsc ? (a.stock || 0) - (b.stock || 0) : (b.stock || 0) - (a.stock || 0);
        return sortAsc ? a.profit - b.profit : b.profit - a.profit;
      });
  }, [products, search, categoryFilter, sortBy, sortAsc]);

  const totalCatalogValue = products.reduce((acc, p) => acc + p.price * (p.stock || 50), 0);
  const totalProfit = products.reduce((acc, p) => acc + p.profit, 0);
  const lowStockCount = products.filter((p) => (p.stock || 0) < 20).length;

  const handleCreateProduct = () => {
    setProductToEdit(null);
    setProductModalOpen(true);
  };

  const handleEditProduct = (prod: ProductItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setProductToEdit(prod);
    setProductModalOpen(true);
  };

  const handleDeleteProduct = (prod: ProductItem, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerDeleteConfirm(
      `${t.action_delete} ${prod.name}`,
      `Deseja realmente remover o produto "${prod.name}" (${prod.sku})?`,
      () => deleteProduct(prod.id)
    );
  };

  return (
    <div id="products-page-container" className="space-y-6 select-none">
      {/* Header Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="text-[11px] font-bold uppercase text-neutral-400">Total de Produtos Ativos</div>
          <div className="text-2xl font-extrabold text-white mt-1 font-mono">{products.length} SKUs</div>
          <div className="text-[10px] text-[#FFD000] font-semibold mt-1 font-mono">Em linha de venda</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="text-[11px] font-bold uppercase text-neutral-400">Lucro Gerado no Catálogo</div>
          <div className="text-2xl font-extrabold text-[#FFD000] mt-1 font-mono">
            {formatCurrency(totalProfit)}
          </div>
          <div className="text-[10px] text-neutral-500 mt-1">Margem média ponderada ~62%</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="text-[11px] font-bold uppercase text-neutral-400">Valor em Estoque</div>
          <div className="text-2xl font-extrabold text-white mt-1 font-mono">
            {formatCurrency(totalCatalogValue)}
          </div>
          <div className="text-[10px] text-neutral-500 mt-1">Inventário disponível</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="text-[11px] font-bold uppercase text-neutral-400">Atenção de Estoque</div>
          <div className="text-2xl font-extrabold text-[#FFD000] mt-1 font-mono">
            {lowStockCount} SKUs
          </div>
          <div className="text-[10px] text-neutral-500 mt-1">&lt; 20 unidades em armazém</div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#1C1C1C] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.search_placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#141414] border border-[#2A2A2A] rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FFD000]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#141414] border border-[#2A2A2A] text-xs font-semibold text-white py-2 px-3 rounded-lg focus:outline-none focus:border-[#FFD000]"
          >
            <option value="all">Todas Categorias</option>
            {categories.filter((c) => c !== 'all').map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSortBy(sortBy === 'profit' ? 'sales' : 'profit');
              setSortAsc(!sortAsc);
            }}
            className="px-3 py-2 rounded-lg bg-[#141414] border border-[#2A2A2A] text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#FFD000]" />
            <span>Ordenar: {sortBy === 'profit' ? 'Lucro' : 'Vendas'}</span>
          </button>

          <button
            id="add-new-product-btn"
            onClick={handleCreateProduct}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD000] hover:bg-[#E6BC00] text-black font-bold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.prod_add_new}</span>
          </button>
        </div>
      </div>

      {/* Product Catalog Table */}
      <div className="bg-[#0A0A0A] rounded-xl border border-[#1C1C1C] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1C1C1C] text-[11px] text-neutral-400 uppercase tracking-wider font-semibold bg-[#111111]">
                <th className="py-3 px-4">{t.prod_name}</th>
                <th className="py-3 px-4">{t.prod_sku}</th>
                <th className="py-3 px-4">{t.prod_category}</th>
                <th className="py-3 px-4 text-right">{t.prod_price}</th>
                <th className="py-3 px-4 text-right">{t.prod_cost}</th>
                <th className="py-3 px-4 text-center">{t.prod_stock}</th>
                <th className="py-3 px-4 text-right">{t.prod_units_sold}</th>
                <th className="py-3 px-4 text-right">{t.prod_profit}</th>
                <th className="py-3 px-4 text-right">Margem</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161616]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-neutral-500">
                    Nenhum produto cadastrado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr
                    key={prod.id}
                    id={`product-row-${prod.id}`}
                    onClick={() => setSelectedProduct(prod)}
                    className="hover:bg-[#141414] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-bold text-white group-hover:text-[#FFD000] transition-colors">
                      {prod.name}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400 font-mono text-[11px] uppercase">
                      {prod.sku}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300">{prod.category}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-white font-mono">
                      {formatCurrency(prod.price)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-neutral-400 font-mono">
                      {formatCurrency(prod.cost)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          (prod.stock || 0) < 20
                            ? 'bg-[#FFD000]/10 text-[#FFD000] border border-[#FFD000]/30'
                            : 'bg-[#141414] text-white border border-[#2A2A2A]'
                        }`}
                      >
                        {prod.stock || 50} un
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-white">{prod.unitsSold}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#FFD000] font-mono text-sm">
                      {formatCurrency(prod.profit)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-white font-semibold">
                      {prod.margin || Math.round(((prod.price - prod.cost) / prod.price) * 100)}%
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          id={`edit-prod-${prod.id}`}
                          onClick={(e) => handleEditProduct(prod, e)}
                          className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-[#222222] transition-colors"
                          title={t.action_edit}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`delete-prod-${prod.id}`}
                          onClick={(e) => handleDeleteProduct(prod, e)}
                          className="p-1.5 rounded text-neutral-400 hover:text-[#FFD000] hover:bg-[#222222] transition-colors"
                          title={t.action_delete}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
