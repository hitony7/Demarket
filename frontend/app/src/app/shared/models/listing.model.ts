export interface Listing {
  id: string;
  title: string;
  category?: string;
  description?: string;
  image?: string | null;
  imageIds?: string[];
  price: number;
  currency: 'ETH' | 'USDC' | 'USDT' | 'DAI';
  saleType?: 'standard' | 'bid';
  bidDuration?: number | null;
  sellerId?: string;
  createdAt?: string;
}

export interface ListingPage {
  listings: Listing[];
  pagination: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
  };
}
