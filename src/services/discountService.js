// Service for handling discount codes and promotions
const API_BASE_URL = 'http://localhost:3001/api';

export const discountService = {
  /**
   * Validate discount code (mã giảm giá - áp dụng cho tất cả khách sạn)
   * @param {string} code - Discount code
   * @param {number} orderAmount - Order total amount
   * @param {string} token - User auth token
   */
  validateDiscountCode: async (code, orderAmount, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v2/discount/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: code.toUpperCase(),
          orderAmount
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error validating discount code:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi kiểm tra mã giảm giá'
      };
    }
  },

  /**
   * Get available discount codes
   */
  getAvailableDiscounts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/v2/discount/available`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting available discounts:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi lấy danh sách mã giảm giá'
      };
    }
  },

  /**
   * Validate hotel promotion code (ưu đãi khách sạn)
   * @param {string} code - Promotion code
   * @param {number} hotelId - Hotel ID
   * @param {number} orderAmount - Order total amount
   */
  validatePromotionCode: async (code, hotelId, orderAmount) => {
    try {
      const response = await fetch(`${API_BASE_URL}/khuyenmai/validate/${code}?hotelId=${hotelId}&orderAmount=${orderAmount}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error validating promotion code:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi kiểm tra mã ưu đãi'
      };
    }
  },

  /**
   * Get active promotions for a hotel
   * @param {number} hotelId - Hotel ID
   */
  getHotelPromotions: async (hotelId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/khuyenmai/active?ma_khach_san=${hotelId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting hotel promotions:', error);
      return {
        success: false,
        message: 'Lỗi kết nối khi lấy danh sách ưu đãi'
      };
    }
  },

  /**
   * Calculate discount amount
   * @param {Object} discount - Discount/promotion data
   * @param {number} orderAmount - Original order amount
   */
  calculateDiscountAmount: (discount, orderAmount) => {
    if (!discount || !discount.discountValue) return 0;

    let discountAmount = 0;
    const isPercentage = discount.discountType?.toLowerCase().includes('percentage') || 
                        discount.discountType?.toLowerCase().includes('phần trăm');

    if (isPercentage) {
      // Percentage discount
      discountAmount = (orderAmount * discount.discountValue) / 100;
      
      // Apply maximum discount limit
      if (discount.maxDiscountValue && discountAmount > discount.maxDiscountValue) {
        discountAmount = discount.maxDiscountValue;
      }
    } else {
      // Fixed amount discount
      discountAmount = discount.discountValue;
      
      // Don't exceed order amount
      if (discountAmount > orderAmount) {
        discountAmount = orderAmount;
      }
    }

    return Math.floor(discountAmount); // Round down to avoid cents
  },

  /**
   * Format discount description for display
   * @param {Object} discount - Discount/promotion data
   */
  formatDiscountDescription: (discount) => {
    if (!discount) return '';

    const isPercentage = discount.discountType?.toLowerCase().includes('percentage') || 
                        discount.discountType?.toLowerCase().includes('phần trăm');
    
    if (isPercentage) {
      let desc = `Giảm ${discount.discountValue}%`;
      if (discount.maxDiscountValue) {
        desc += ` (tối đa ${discount.maxDiscountValue.toLocaleString('vi-VN')}₫)`;
      }
      return desc;
    } else {
      return `Giảm ${discount.discountValue.toLocaleString('vi-VN')}₫`;
    }
  }
};

// Mock service for development (fallback when backend is not available)
export const mockDiscountService = {
  validateDiscountCode: async (code, orderAmount) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockDiscounts = {
      'WELCOME20': {
        code: 'WELCOME20',
        description: 'Giảm 20% cho khách hàng mới',
        discountType: 'percentage',
        discountValue: 20,
        minOrderValue: 500000,
        maxDiscountValue: 200000,
        discountAmount: Math.min((orderAmount * 20) / 100, 200000)
      },
      'SAVE50K': {
        code: 'SAVE50K',
        description: 'Giảm 50,000₫ cho đơn hàng từ 1,000,000₫',
        discountType: 'fixed_amount',
        discountValue: 50000,
        minOrderValue: 1000000,
        maxDiscountValue: null,
        discountAmount: 50000
      },
      'HOTEL30': {
        code: 'HOTEL30',
        description: 'Giảm 30% cho khách sạn này',
        discountType: 'percentage',
        discountValue: 30,
        minOrderValue: 800000,
        maxDiscountValue: 500000,
        discountAmount: Math.min((orderAmount * 30) / 100, 500000)
      }
    };

    const discount = mockDiscounts[code.toUpperCase()];
    
    if (!discount) {
      return {
        success: false,
        message: 'Mã giảm giá không tồn tại'
      };
    }

    if (orderAmount < discount.minOrderValue) {
      return {
        success: false,
        message: `Đơn hàng tối thiểu ${discount.minOrderValue.toLocaleString('vi-VN')}₫ để áp dụng mã này`
      };
    }

    return {
      success: true,
      message: 'Mã giảm giá hợp lệ',
      data: discount
    };
  },

  getAvailableDiscounts: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: [
        {
          code: 'WELCOME20',
          description: 'Giảm 20% cho khách hàng mới',
          discountType: 'percentage',
          discountValue: 20,
          minOrderValue: 500000,
          maxDiscountValue: 200000
        },
        {
          code: 'SAVE50K',
          description: 'Giảm 50,000₫ cho đơn hàng từ 1,000,000₫',
          discountType: 'fixed_amount',
          discountValue: 50000,
          minOrderValue: 1000000,
          maxDiscountValue: null
        }
      ]
    };
  }
};