import { create } from 'zustand';
import type { Asset } from '@domain/entities/Asset';

interface AssetsFiltersState {
  perPage: number;
  search: string;
  sortKey: keyof Asset | null;
  sortDir: 'asc' | 'desc' | null;

  setPerPage: (perPage: number) => void;
  setSearch: (term: string) => void;
  setSort: (key: keyof Asset | null, dir: 'asc' | 'desc' | null) => void;
}

export const useAssetsFilters = create<AssetsFiltersState>((set) => ({
  perPage: 10,
  search: '',
  sortKey: null,
  sortDir: null,

  setPerPage: (perPage) => set({ perPage }),
  setSearch: (search) => set({ search }),
  setSort: (sortKey, sortDir) => set({ sortKey, sortDir }),
}));
