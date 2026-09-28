import { Item } from '../types';
import { INITIAL_SAMPLE_ITEMS } from '../data/sampleItems';

const STORAGE_KEY = 'campus_lost_found_items_v1';

export function loadItemsFromStorage(): Item[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed initial sample data into localStorage
      saveItemsToStorage(INITIAL_SAMPLE_ITEMS);
      return INITIAL_SAMPLE_ITEMS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SAMPLE_ITEMS;
  } catch (err) {
    console.error('Failed to load items from storage:', err);
    return INITIAL_SAMPLE_ITEMS;
  }
}

export function saveItemsToStorage(items: Item[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save items to storage:', err);
  }
}

export function resetToSampleData(): Item[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_ITEMS));
    return INITIAL_SAMPLE_ITEMS;
  } catch (err) {
    console.error('Failed to reset sample items:', err);
    return INITIAL_SAMPLE_ITEMS;
  }
}
