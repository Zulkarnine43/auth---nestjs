export interface Products {
  id: number;
  name: string;
  sku: null | string;
  status: string;
  category: Category;
  brand: Brand;
}

export interface Brand {
  name: string;
}

export interface Category {
  name: string;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
}
