export interface SearchableDropdownOption {
  id?: string | number;
  value: string;
  label: string;
  category?: string;
  type?: 'product' | 'user' | 'post' | 'query' | 'option';
  icon?: string;
}

export interface SearchableDropdownProps {
  // Core props
  mode?: 'select' | 'search';
  options?: SearchableDropdownOption[];
  value?: string;
  onChange?: (value: string, option?: SearchableDropdownOption) => void;
  onSearch?: (query: string) => void;
  apiSearchType?: 'products' | 'users' | 'posts' | 'all';
  enableApiSearch?: boolean;
   debounceDelay?: number;
  // Styling & behavior
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  enableAutocomplete?: boolean;
  showCategoryIcons?: boolean;
  maxSuggestions?: number;
  maxHeight?: number;
  
  // Form specific (for select mode)
  name?: string;
  label?: string;
  error?: string;
  required?: boolean;
  isClearable?: boolean;
  
  // Callbacks
  onFocus?: () => void;
  onBlur?: () => void;
}
