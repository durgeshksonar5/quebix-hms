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
    <div className="flex flex-col w-full h-full bg-card rounded-2xl border border-border overflow-hidden">
      {/* Table Area */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-border/20 text-xs font-semibold uppercase tracking-wider text-text-muted select-none">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-4 font-semibold ${col.sortable ? 'cursor-pointer hover:bg-border/30 hover:text-text' : ''} ${col.className || ''}`}
                  onClick={() => col.sortable && requestSort(col.accessor)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && <ArrowUpDown className="h-3 w-3" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm text-text">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr key={row.id || rowIdx} className="hover:bg-border/10 transition-colors duration-150">
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
                    <Inbox className="h-10 w-10 text-text-muted/50" />
                    <p className="text-sm font-medium text-text-muted">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Area */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-border/5">
          <div className="text-xs text-text-muted">
            Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
            <span className="font-semibold">{Math.min(startIndex + pageSize, totalItems)}</span> of{' '}
            <span className="font-semibold">{totalItems}</span> entries
          </div>
          <div className="flex items-center gap-2">
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
                className={`h-8 w-8 text-xs font-semibold rounded-lg border transition-colors ${
                  activePage === pg
                    ? 'bg-primary text-white border-primary'
                    : 'border-border text-text hover:bg-border/30'
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
