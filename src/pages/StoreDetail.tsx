import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  List,
  Map,
  Navigation,
  ArrowLeft,
  MapPin,
  DoorOpen,
  CheckSquare,
  DollarSign,
  Search,
  Mic,
} from 'lucide-react';
import { Store } from '@/types/store';
import { stores } from '@/data/stores';
import { ShopperHeader } from '@/components/ShopperHeader';
import { toast } from 'sonner';
import { booths } from '@/data/booths'; // Import booths data

interface PurchasedProduct {
  id: string;
  name: string;
  price: number;
  checked: boolean;
}

const PRODUCTS_PER_PAGE = 10;

const StoreDetail = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [purchasedProducts, setPurchasedProducts] = useState<
    PurchasedProduct[]
  >([]);
  const [showChecklist, setShowChecklist] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const store = stores.find((s) => s.id === storeId);
    if (store) {
      setSelectedStore(store);
    } else {
      navigate('/shopper');
    }
  }, [storeId, navigate]);

  useEffect(() => {
    if (!selectedStore) return;
    setHasMore(page * PRODUCTS_PER_PAGE < selectedStore.products.length);
  }, [page, selectedStore]);

  const filteredProducts =
    selectedStore?.products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.booth.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const displayedProducts = filteredProducts.slice(0, page * PRODUCTS_PER_PAGE);

  useEffect(() => {
    if (!hasMore) return;

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });

    if (lastProductRef.current) {
      observer.current.observe(lastProductRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, filteredProducts]);

  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Voice search is not supported in this browser.');
    }
  };

  const handleBack = () => {
    if (showChecklist) {
      setShowChecklist(false);
    } else {
      navigate('/shopper');
    }
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCheckout = () => {
    if (!selectedStore || selectedProducts.length === 0) return;

    const newPurchasedProducts = selectedProducts
      .map((id) => {
        const product = selectedStore.products.find((p) => p.id === id);
        if (!product) return null;
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          checked: false,
        };
      })
      .filter((p): p is PurchasedProduct => p !== null);

    setPurchasedProducts((prev) => [...prev, ...newPurchasedProducts]);
    setShowChecklist(true);
    toast.success(
      'Checkout successful! Your items have been added to the checklist.'
    );
  };

  const handleToggleChecked = (productId: string) => {
    setPurchasedProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, checked: !product.checked }
          : product
      )
    );
  };

  const getOptimizedRoute = (products: string[]) => {
    if (!selectedStore) return [];
    return selectedStore.products
      .filter((p) => products.includes(p.id))
      .sort((a, b) => {
        const [aAisle, aPos] = a.booth.split('');
        const [bAisle, bPos] = b.booth.split('');
        return aAisle.localeCompare(bAisle) || aPos.localeCompare(bPos);
      });
  };

  if (!selectedStore) {
    return null;
  }

  if (showChecklist) {
    return (
      <div className='min-h-screen bg-surface-secondary'>
        <ShopperHeader />
        <div className='container mx-auto p-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='max-w-7xl mx-auto'
          >
            <button
              onClick={handleBack}
              className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6'
            >
              <ArrowLeft className='w-5 h-5' />
              Back to Shopping
            </button>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='bg-surface rounded-xl p-6 shadow-sm'>
                <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
                  <CheckSquare className='w-5 h-5 text-secondary' />
                  Shopping Checklist
                </h2>
                <div className='space-y-4'>
                  {purchasedProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`bg-gray-50 rounded-lg p-4 flex justify-between items-center cursor-pointer ${
                        product.checked ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => handleToggleChecked(product.id)}
                    >
                      <div className='flex items-center gap-3'>
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center ${
                            product.checked
                              ? 'bg-secondary border-secondary'
                              : 'border-gray-300'
                          }`}
                        >
                          {product.checked && (
                            <CheckSquare className='w-4 h-4 text-white' />
                          )}
                        </div>
                        <span
                          className={
                            product.checked ? 'line-through text-gray-500' : ''
                          }
                        >
                          {product.name}
                        </span>
                      </div>
                      <span className='font-medium'>${product.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className='bg-surface rounded-xl p-6 shadow-sm'>
                <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
                  <DollarSign className='w-5 h-5 text-secondary' />
                  Shopping Summary
                </h2>
                <div className='space-y-4'>
                  <div className='bg-gray-50 rounded-lg p-4'>
                    <div className='flex justify-between items-center mb-2'>
                      <span className='text-gray-600'>Total Spent</span>
                      <span className='font-semibold text-xl'>
                        $
                        {purchasedProducts
                          .reduce((sum, p) => sum + p.price, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-600'>Remaining Items</span>
                      <span className='font-medium'>
                        {purchasedProducts.filter((p) => !p.checked).length}{' '}
                        items
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const optimizedRoute = getOptimizedRoute(selectedProducts);

  return (
    <div className='min-h-screen bg-surface-secondary'>
      <ShopperHeader />
      <div className='container mx-auto p-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='max-w-7xl mx-auto'
        >
          <button
            onClick={handleBack}
            className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6'
          >
            <ArrowLeft className='w-5 h-5' />
            Back to Stores
          </button>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-surface rounded-xl p-6 shadow-sm'>
              <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
                <List className='w-5 h-5 text-secondary' />
                Products at {selectedStore?.name}
              </h2>

              <div className='sticky top-0 z-10 bg-surface pt-4 pb-2 mb-4'>
                <div className='flex gap-2'>
                  <div className='relative flex-1'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                    <input
                      type='text'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder='Search products or booth...'
                      className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm'
                    />
                  </div>
                  <button
                    onClick={startVoiceSearch}
                    className={`p-3 rounded-lg ${
                      isListening
                        ? 'bg-secondary text-white'
                        : 'bg-gray-100 text-gray-600'
                    } hover:bg-secondary hover:text-white transition-colors shadow-sm`}
                  >
                    <Mic className='w-5 h-5' />
                  </button>
                </div>
              </div>

              <div className='space-y-4 max-h-[600px] overflow-y-auto px-2 py-2'>
                {displayedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    ref={
                      index === displayedProducts.length - 1
                        ? lastProductRef
                        : null
                    }
                    className={`bg-gray-50 rounded-lg p-4 flex justify-between items-center cursor-pointer ${
                      selectedProducts.includes(product.id)
                        ? 'ring-2 ring-secondary'
                        : ''
                    }`}
                    onClick={() => handleProductToggle(product.id)}
                  >
                    <div>
                      <h3 className='font-medium'>{product.name}</h3>
                      <p className='text-sm text-gray-600'>
                        Booth: {product.booth}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='font-semibold'>${product.price}</p>
                      <span
                        className={`text-sm ${
                          product.inStock ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                ))}
                {hasMore && (
                  <div className='text-center py-4'>
                    <span className='text-gray-500'>
                      Loading more products...
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className='bg-surface rounded-xl p-6 shadow-sm'>
              <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
                <Map className='w-5 h-5 text-secondary' />
                Store Map
              </h2>
              <div className='grid grid-cols-[100px,1fr]'>
                <div className='relative'>
                  <div className='top-0 flex items-center gap-1 text-secondary font-medium'>
                    <DoorOpen className='w-5 h-5' />
                    Entrance
                  </div>
                  <div className='top-2 text-accent'>
                    <MapPin className='w-6 h-6' />
                  </div>
                </div>
                <div className='grid grid-cols-4 gap-2 aspect-square relative'>
                  {booths.map((row) =>
                    row.map((booth) => {
                      const product = selectedStore.products.find(
                        (p) => p.booth === booth.name
                      );
                      const isSelected =
                        product && selectedProducts.includes(product.id);
                      return (
                        <div
                          key={booth.name}
                          className={`border rounded-lg p-2 text-sm relative overflow-hidden min-w-[90px] min-h-[90px] group ${
                            isSelected
                              ? 'ring-2 ring-secondary'
                              : product
                              ? 'ring-1 ring-secondary/30'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <img
                            src={booth.boothImage}
                            alt={`Booth ${booth.name}`}
                            className='absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity'
                          />
                          <div className='relative z-10 bg-white/80 rounded p-1'>
                            <div className='font-medium text-secondary'>
                              {booth.name}
                            </div>
                            {selectedStore.products
                              .filter((p) => p.booth === booth.name)
                              .map((p) => (
                                <div
                                  key={p.id}
                                  className='text-xs text-gray-800 truncate'
                                >
                                  {p.name}
                                </div>
                              ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className='col-span-1 md:col-span-2 bg-surface rounded-xl p-6 shadow-sm'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <Navigation className='w-5 h-5 text-secondary' />
                  Shopping Route
                </h2>
                {selectedProducts.length > 0 && (
                  <button
                    onClick={handleCheckout}
                    className='bg-secondary hover:bg-secondary-hover text-white px-4 py-2 rounded-lg flex items-center gap-2'
                  >
                    <DollarSign className='w-5 h-5' />
                    Checkout
                  </button>
                )}
              </div>
              {selectedProducts.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-4'>
                    <p className='text-gray-600 font-medium'>
                      Step-by-step directions:
                    </p>
                    <div className='space-y-4'>
                      <div className='bg-gray-50 rounded-lg p-4'>
                        <p className='text-sm text-gray-600 mb-2'>
                          Starting point: Main entrance (near A1)
                        </p>
                      </div>
                      {optimizedRoute.map((product, index) => (
                        <div
                          key={product.id}
                          className='bg-gray-50 rounded-lg p-4'
                        >
                          <div className='flex items-center gap-4 mb-2'>
                            <span className='bg-secondary text-white w-8 h-8 rounded-full flex items-center justify-center font-medium'>
                              {index + 1}
                            </span>
                            <div>
                              <h3 className='font-medium'>{product.name}</h3>
                              <p className='text-sm text-gray-600'>
                                Booth: {product.booth}
                              </p>
                            </div>
                          </div>
                          <p className='text-sm text-gray-600 mt-2'>
                            {index === 0
                              ? `From the entrance, go to aisle ${product.booth[0]} and find position ${product.booth[1]}.`
                              : `From ${
                                  optimizedRoute[index - 1].booth
                                }, move to aisle ${product.booth[0]} position ${
                                  product.booth[1]
                                }.`}
                          </p>
                        </div>
                      ))}
                      <div className='bg-gray-50 rounded-lg p-4'>
                        <p className='text-sm text-gray-600'>
                          Return to entrance with your items.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className='text-gray-600 font-medium mb-4'>Route Map:</p>
                    <div className='grid grid-cols-[100px,1fr]'>
                      <div className='relative'>
                        <div className='top-0 flex items-center gap-1 text-secondary font-medium'>
                          <DoorOpen className='w-5 h-5' />
                          Entrance
                        </div>
                        <div className='top-2 text-accent'>
                          <MapPin className='w-6 h-6' />
                        </div>
                      </div>
                      <div className='grid grid-cols-4 gap-2 aspect-square relative'>
                        {booths.map((row) =>
                          row.map((booth) => {
                            const product = selectedStore.products.find(
                              (p) => p.booth === booth.name
                            );
                            const isSelected =
                              product && selectedProducts.includes(product.id);
                            const routeIndex = optimizedRoute.findIndex(
                              (p) => p.booth === booth.name
                            );
                            return (
                              <div
                                key={booth.name}
                                className={`border rounded-lg p-2 text-sm relative overflow-hidden min-w-[90px] min-h-[90px] ${
                                  isSelected
                                    ? 'bg-secondary border-secondary'
                                    : product
                                    ? 'bg-secondary/10 border-secondary'
                                    : 'bg-gray-50 border-gray-200'
                                }`}
                              >
                                <img
                                  src={booth.boothImage}
                                  alt={`Booth ${booth.name}`}
                                  className='absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity'
                                />
                                <div className='relative z-10 bg-white/80 rounded p-1'>
                                  <div className='font-medium text-secondary'>
                                    {booth.name}
                                  </div>
                                  {isSelected && (
                                    <div className='bg-white text-secondary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold'>
                                      {routeIndex + 1}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className='text-gray-600'>
                  Select products to see your optimized shopping route.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StoreDetail;
