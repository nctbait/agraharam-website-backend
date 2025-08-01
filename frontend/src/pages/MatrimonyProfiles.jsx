// MatrimonySearch.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import api from '../api/authAxios';

const MatrimonySearch = () => {
  const [profiles, setProfiles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerms, setSearchTerms] = useState({});
  const [visibleColumns, setVisibleColumns] = useState({});
  const [sorts, setSorts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const allColumns = [
    { key: 'name', label: 'Name' },
    { key: 'gender', label: 'Gender' },
    { key: 'dateOfBirth', label: 'Date of Birth' },
    { key: 'gothram', label: 'Gothram' },
    { key: 'nakshatram', label: 'Nakshatram' },
    { key: 'vedam', label: 'Vedam' },
    { key: 'education', label: 'Education' },
    { key: 'occupation', label: 'Occupation' },
    { key: 'currentLocation', label: 'Current Location' }
  ];

  useEffect(() => {
    const fetchAll = async () => {
      const res = await api.get('/api/matrimony/all-profiles');
      setProfiles(res);
      setFiltered(res);
      const visibilityMap = {};
      allColumns.forEach(col => visibilityMap[col.key] = true);
      setVisibleColumns(visibilityMap);
    };
    fetchAll();
  }, []);

  const operators = [
    { label: 'is', value: 'eq' },
    { label: 'is not', value: 'neq' },
    { label: 'in', value: 'in' },
    { label: 'not in', value: 'notIn' },
    { label: 'like', value: 'like' },
    { label: 'not like', value: 'notLike' }
  ];

  const updateSearchTerm = (field, operator, values) => {
    const cleanedValues = values
      .split(',')
      .map(v => v.trim().toLowerCase())
      .filter(v => v.length > 0);

    const updated = {
      ...searchTerms,
      [field]: cleanedValues.length > 0 ? { operator, values: cleanedValues } : undefined
    };

    const cleaned = Object.fromEntries(
      Object.entries(updated).filter(([_, val]) => val !== undefined)
    );

    setSearchTerms(cleaned);
    applyFilters(cleaned, sorts);
  };

  const toggleSort = (field) => {
    setSorts(prev => {
      const existing = prev.find(s => s.key === field);
      if (existing) {
        const direction = existing.direction === 'asc' ? 'desc' : 'asc';
        return [...prev.filter(s => s.key !== field), { key: field, direction }];
      } else {
        return [...prev, { key: field, direction: 'asc' }];
      }
    });
  };

  const clearSorts = () => {
    setSorts([]);
    applyFilters(searchTerms, []);
  };

  useEffect(() => {
    applyFilters(searchTerms, sorts);
  }, [sorts]);

  const applyFilters = (terms, sortList) => {
    let filteredList = profiles;

    if (Object.keys(terms).length > 0) {
      filteredList = profiles.filter(profile =>
        Object.entries(terms).every(([field, { operator, values }]) => {
          const fieldVal = (profile[field] || '').toString().toLowerCase();
          switch (operator) {
            case 'eq': return values.includes(fieldVal);
            case 'neq': return !values.includes(fieldVal);
            case 'in': return values.some(v => fieldVal.includes(v));
            case 'notIn': return values.every(v => !fieldVal.includes(v));
            case 'like': return values.some(v => fieldVal.includes(v));
            case 'notLike': return values.every(v => !fieldVal.includes(v));
            default: return true;
          }
        })
      );
    }

    for (let i = sortList.length - 1; i >= 0; i--) {
      const { key, direction } = sortList[i];
      filteredList = filteredList.sort((a, b) => {
        const valA = (a[key] || '').toString().toLowerCase();
        const valB = (b[key] || '').toString().toLowerCase();
        return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }

    setFiltered(filteredList);
    setCurrentPage(1);
  };

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar isOpen={true} />
        <main className="flex-1 max-w-7xl mx-auto p-6">
          <h1 className="text-xl font-bold mb-4">Matrimony Profile Search</h1>

          <div className="mb-4 flex flex-wrap gap-4 items-center">
            {allColumns.map(col => (
              <label key={col.key} className="text-sm flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={visibleColumns[col.key]}
                  onChange={() =>
                    setVisibleColumns(prev => ({ ...prev, [col.key]: !prev[col.key] }))
                  }
                />
                {col.label}
              </label>
            ))}
            <select value={pageSize} onChange={e => setPageSize(parseInt(e.target.value))} className="ml-auto text-sm border px-2 py-1">
              {[10, 25, 50, 100].map(size => (
                <option key={size} value={size}>{size} / page</option>
              ))}
            </select>
            {sorts.length > 0 && (
              <button onClick={clearSorts} className="ml-4 px-3 py-1 bg-red-500 text-white text-xs rounded">Clear Sort</button>
            )}
          </div>

          <div className="overflow-x-auto rounded shadow border">
            <table className="min-w-full text-sm text-left table-auto w-full">
              <thead className="bg-gray-100">
                <tr>
                  {allColumns.filter(col => visibleColumns[col.key]).map(col => {
                    const sortIndex = sorts.findIndex(s => s.key === col.key);
                    const sortIndicator = sortIndex !== -1 ? `${sortIndex + 1}${sorts[sortIndex].direction === 'asc' ? '↑' : '↓'}` : '';
                    return (
                      <th key={col.key} className="p-2 whitespace-nowrap">
                        <div className="flex flex-col gap-1 min-w-[100px]">
                          <span
                            className="font-semibold text-xs text-gray-700 uppercase cursor-pointer"
                            onClick={() => toggleSort(col.key)}
                          >
                            {col.label} {sortIndicator}
                          </span>
                          <select
                            className="form-select border px-1 py-1 text-xs"
                            onChange={e => {
                              const prev = searchTerms[col.key] || { operator: 'eq', values: [] };
                              updateSearchTerm(col.key, e.target.value, (prev.values || []).join(','));
                            }}
                            value={searchTerms[col.key]?.operator || 'eq'}
                          >
                            {operators.map(op => (
                              <option key={op.value} value={op.value}>{op.label}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            className="form-input px-2 py-1 border border-gray-300 rounded text-xs"
                            placeholder={`Value${searchTerms[col.key]?.operator?.includes('in') ? 's (comma separated)' : ''}`}
                            value={searchTerms[col.key]?.values?.join(',') || ''}
                            onChange={e => {
                              const prev = searchTerms[col.key] || { operator: 'eq', values: [] };
                              updateSearchTerm(col.key, prev.operator, e.target.value);
                            }}
                          />
                        </div>
                      </th>
                    );
                  })}
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginated.map((p, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    {allColumns.filter(col => visibleColumns[col.key]).map(col => (
                      <td key={col.key} className="p-2 whitespace-nowrap max-w-xs truncate">{p[col.key]}</td>
                    ))}
                    <td className="p-2 text-blue-600 underline cursor-pointer">
                      <button onClick={() => navigate(`/matrimony-profile/${p.id}`)}>View</button>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={allColumns.length + 1} className="p-4 text-center text-gray-500">
                      No matching profiles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="space-x-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded">Prev</button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-200 rounded">Next</button>
            </div>
          </div>

        </main>
      </div>
      <Footer />
    </>
  );
};

export default MatrimonySearch;
