import React, { useState } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import Button from '../common/Button';

export default function DataTable({
  columns = [],
  data = [],
  pageSize = 10,
  searchQuery = '',
  searchFields = [],
  filters = {}, // e.g. { gender: 'Male' }
  emptyMessage = 'No records found'
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // 1. Apply Search
  let processedData = [...data];
  if (searchQuery && searchFields.length > 0) {
    const query = searchQuery.toLowerCase();
    processedData = processedData.filter((item) => {
      return searchFields.some((field) => {
        const val = item[field];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(query);
      });
    });
  }

  // 2. Apply Filters
  Object.keys(filters).forEach((key) => {
    const filterValue = filters[key];
    if (filterValue !== '' && filterValue !== undefined && filterValue !== null) {
      processedData = processedData.filter((item) => {
        return String(item[key]).toLowerCase() === String(filterValue).toLowerCase();
      });
    }
  });

  // 3. Apply Sorting
  if (sortConfig.key) {
    processedData.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // 4. Apply Pagination
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  
  // Reset page if it exceeds totalPages
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  
  const startIndex = (activePage - 1) * pageSize;
  const paginatedData = processedData.slice(startIndex, startIndex + pageSize);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="flex flex-col w-full h-full bg-card/60 backdrop-blur-md rounded-2xl border border-border/80 overflow-hidden shadow-soft">
      {/* Table Area */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/60 bg-border/10 text-xs font-semibold uppercase tracking-wider text-text-muted/80 select-none">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-4 font-semibold ${col.sortable ? 'cursor-pointer hover:bg-border/30 hover:text-text transition-colors' : ''} ${col.className || ''}`}
                  onClick={() => col.sortable && requestSort(col.accessor)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && <ArrowUpDown className="h-3.5 w-3.5 text-text-muted/60" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-sm text-text">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr key={row.id || rowIdx} className="hover:bg-primary/[0.04] dark:hover:bg-primary/[0.08] transition-colors duration-200">
                  {columns.map((col, colIdx) => {
                    const value = col.accessor ? row[col.accessor] : null;
                    return (
                      <td key={colIdx} className={`px-6 py-4 whitespace-nowrap ${col.className || ''}`}>
                        {col.render ? col.render(row, value) : value}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Inbox className="h-10 w-10 text-text-muted/40" />
                    <p className="text-sm font-semibold text-text-muted">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Area */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/50 px-6 py-4 bg-border/5">
          <div className="text-xs text-text-muted font-medium">
            Showing <span className="font-bold text-text">{startIndex + 1}</span> to{' '}
            <span className="font-bold text-text">{Math.min(startIndex + pageSize, totalItems)}</span> of{' '}
            <span className="font-bold text-text">{totalItems}</span> entries
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={activePage === 1}
              icon={<ChevronLeft className="h-4 w-4" />}
            />
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`h-9 w-9 text-xs font-bold rounded-xl border transition-all active:scale-90 ${
                  activePage === pg
                    ? 'bg-gradient-to-br from-primary to-primary-dark text-white border-primary/20 shadow-md shadow-primary/10'
                    : 'border-border/60 bg-surface/50 text-text hover:bg-border/30 hover:border-text-muted'
                }`}
              >
                {pg}
              </button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={activePage === totalPages}
              icon={<ChevronRight className="h-4 w-4" />}
            />
          </div>
        </div>
      )}
    </div>
  );
}
