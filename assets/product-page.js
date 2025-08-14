// Product Page JavaScript - Gallery, Variants, and Cart Functions

class ProductGallery {
  constructor() {
    this.mainImage = document.getElementById('main-product-image');
    this.thumbnails = document.querySelectorAll('.thumbnail-item');
    this.init();
  }
  
  init() {
    this.thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', () => {
        const mediaUrl = thumbnail.dataset.mediaUrl;
        const mediaAlt = thumbnail.dataset.mediaAlt;
        
        if (this.mainImage && mediaUrl) {
          this.mainImage.src = mediaUrl;
          this.mainImage.alt = mediaAlt;
          
          this.thumbnails.forEach(t => t.classList.remove('active'));
          thumbnail.classList.add('active');
        }
      });
    });
    
    if (this.thumbnails.length > 0) {
      this.thumbnails[0].classList.add('active');
    }
  }
}

class ProductVariants {
  constructor() {
    this.variantRadios = document.querySelectorAll('.variant-radio');
    this.productForm = document.querySelector('.product-form');
    this.init();
  }
  
  init() {
    this.variantRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        this.updateSelectedVariant();
      });
    });
  }
  
  updateSelectedVariant() {
    const selectedOptions = {};
    this.variantRadios.forEach(radio => {
      if (radio.checked) {
        const optionName = radio.name.replace('options[', '').replace(']', '');
        selectedOptions[optionName] = radio.value;
      }
    });
    
    console.log('Selected options:', selectedOptions);
    // Note: In a complete Shopify theme, you would use this to find the matching variant
    // and update pricing, availability, etc. This requires additional Shopify variant logic.
  }
}

class QuantitySelector {
  constructor() {
    this.quantityInput = document.getElementById('quantity');
    this.decreaseBtn = document.querySelector('.quantity-decrease');
    this.increaseBtn = document.querySelector('.quantity-increase');
    this.init();
  }
  
  init() {
    if (this.decreaseBtn) {
      this.decreaseBtn.addEventListener('click', () => {
        this.updateQuantity(-1);
      });
    }
    
    if (this.increaseBtn) {
      this.increaseBtn.addEventListener('click', () => {
        this.updateQuantity(1);
      });
    }
    
    if (this.quantityInput) {
      this.quantityInput.addEventListener('change', () => {
        this.validateQuantity();
      });
    }
  }
  
  updateQuantity(change) {
    if (!this.quantityInput) return;
    
    const currentValue = parseInt(this.quantityInput.value) || 1;
    const newValue = Math.max(1, currentValue + change);
    this.quantityInput.value = newValue;
  }
  
  validateQuantity() {
    const value = parseInt(this.quantityInput.value) || 1;
    this.quantityInput.value = Math.max(1, value);
  }
}

class ProductForm {
  constructor() {
    this.form = document.querySelector('.product-form');
    this.addToCartBtn = document.querySelector('.add-to-cart-btn');
    this.buyNowBtn = document.querySelector('.buy-now-btn');
    this.init();
  }
  
  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        this.handleAddToCart(e);
      });
    }
    
    if (this.buyNowBtn) {
      this.buyNowBtn.addEventListener('click', () => {
        this.handleBuyNow();
      });
    }
  }
  
  handleAddToCart(e) {
    e.preventDefault();
    
    if (this.addToCartBtn) {
      this.addToCartBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Adding to Cart...';
      this.addToCartBtn.disabled = true;
    }
    
    const formData = new FormData(this.form);
    
    fetch('/cart/add.js', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      this.showAddToCartSuccess();
      this.updateCartCount();
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      this.showAddToCartError();
    })
    .finally(() => {
      if (this.addToCartBtn) {
        this.addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart mr-2"></i>Add to Cart';
        this.addToCartBtn.disabled = false;
      }
    });
  }
  
  handleBuyNow() {
    if (this.form) {
      const formData = new FormData(this.form);
      
      fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        window.location.href = '/checkout';
      })
      .catch(error => {
        console.error('Error with buy now:', error);
        this.showAddToCartError();
      });
    }
  }
  
  showAddToCartSuccess() {
    this.showNotification('Added to Cart!', 'success');
  }
  
  showAddToCartError() {
    this.showNotification('Error adding to cart', 'error');
  }
  
  showNotification(message, type) {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-accent text-primary' : 'bg-red-500 text-white';
    const icon = type === 'success' ? 'fas fa-check' : 'fas fa-exclamation-triangle';
    
    notification.className = `cart-notification fixed top-4 right-4 ${bgColor} px-6 py-3 rounded-lg font-bold z-50 transform translate-x-full transition-transform duration-300`;
    notification.innerHTML = `<i class="${icon} mr-2"></i>${message}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
  
  updateCartCount() {
    // Fetch current cart to update any cart counters in the header
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        console.log('Cart updated:', cart);
        // Update cart count in header if you have one
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
          element.textContent = cart.item_count;
        });
      })
      .catch(error => {
        console.error('Error fetching cart:', error);
      });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize product page functionality
  new ProductGallery();
  new ProductVariants();
  new QuantitySelector();
  new ProductForm();
  
  // Smooth fade-in for video
  const videoElement = document.querySelector('.product-highlight-video video');
  if (videoElement) {
    videoElement.addEventListener('loadeddata', () => {
      videoElement.style.opacity = '1';
    });
  }
});