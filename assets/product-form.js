if (!customElements.get('product-form')) {
  customElements.define('product-form', class ProductForm extends HTMLElement {
    constructor() {
      super();

      this.form = this.querySelector('form');
      this.form.querySelector('[name=id]').disabled = false;
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
      this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
      this.submitButton = this.querySelector('[type="submit"]');
      if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');
    }

    onSubmitHandler(evt) {
      evt.preventDefault();
      if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

      this.handleErrorMessage();

      this.submitButton.setAttribute('aria-disabled', true);
      this.submitButton.classList.add('loading');
      this.querySelector('.loading-overlay__spinner').classList.remove('hidden');

      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];

      const formData = new FormData(this.form);
      if (this.cart) {
        formData.append('sections', this.cart.getSectionsToRender().map((section) => section.id));
        formData.append('sections_url', window.location.pathname);
        config.body = formData;
      }

      fetch(`${routes.cart_add_url}`, config)
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            this.handleErrorMessage(response.description);

            const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
            if (!soldOutMessage) return;
            this.submitButton.setAttribute('aria-disabled', true);
            this.submitButton.querySelector('span').classList.add('hidden');
            soldOutMessage.classList.remove('hidden');
            this.error = true;
            return;
          } else if (!this.cart) {
            window.location = window.routes.cart_url;
            return;
          }

          this.error = false;
          const quickAddModal = this.closest('quick-add-modal');
          if (quickAddModal) {
            document.body.addEventListener('modalClosed', () => {
              setTimeout(() => { this.cart.renderContents(response) });
            }, { once: true });
            quickAddModal.hide(true);
          } else {
            this.cart.renderContents(response);
          }
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          this.submitButton.classList.remove('loading');
          if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
          if (!this.error) this.submitButton.removeAttribute('aria-disabled');
          this.querySelector('.loading-overlay__spinner').classList.add('hidden');
        });
    }

    handleErrorMessage(errorMessage = false) {
      this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
      if (!this.errorMessageWrapper) return;
      this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

      this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

      if (errorMessage) {
        this.errorMessage.textContent = errorMessage;
      }
    }
  });
}

// Pickup availability component
class PickupAvailability extends HTMLElement {
  constructor() {
    super();

    if (!this.hasAttribute('available')) return;

    this.errorHtml = this.querySelector('template').content.firstElementChild.cloneNode(true);
    this.onClickRefreshList = this.onClickRefreshList.bind(this);
    this.fetchAvailability(this.dataset.variantId);
  }

  fetchAvailability(variantId) {
    const variantSectionUrl = `${this.dataset.baseUrl}/variants/${variantId}/?section_id=pickup-availability`;

    fetch(variantSectionUrl)
      .then(response => response.text())
      .then(text => {
        const sectionInnerHTML = new DOMParser()
          .parseFromString(text, 'text/html')
          .querySelector('.shopify-section');
        this.renderPreview(sectionInnerHTML);
      })
      .catch(e => {
        const button = this.querySelector('button');
        if (button) button.removeEventListener('click', this.onClickRefreshList);
        this.renderError();
      });
  }

  onClickRefreshList(evt) {
    this.fetchAvailability(this.dataset.variantId);
  }

  renderError() {
    this.innerHTML = '';
    this.appendChild(this.errorHtml);

    this.querySelector('button').addEventListener('click', this.onClickRefreshList);
  }

  renderPreview(sectionInnerHTML) {
    const drawer = document.querySelector('pickup-availability-drawer');
    if (drawer) drawer.remove();
    if (!sectionInnerHTML.querySelector('pickup-availability-preview')) {
      this.innerHTML = '';
      this.removeAttribute('available');
      return;
    }

    this.innerHTML = sectionInnerHTML.querySelector('pickup-availability-preview').outerHTML;
    this.setAttribute('available', '');

    document.body.appendChild(sectionInnerHTML.querySelector('pickup-availability-drawer'));

    const button = this.querySelector('button');
    if (button) button.addEventListener('click', (evt) => {
      document.querySelector('pickup-availability-drawer').show(evt.target);
    });
  }
}

customElements.define('pickup-availability', PickupAvailability);

// Quick add modal
class QuickAddModal extends ModalDialog {
  constructor() {
    super();
    this.modalContent = this.querySelector('[id^="QuickAddInfo-"]');
  }

  hide(preventFocus = false) {
    const cartNotification = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
    if (cartNotification) cartNotification.setActiveElement(this.openedBy);
    super.hide(preventFocus);
  }

  show(opener) {
    opener.setAttribute('aria-disabled', true);
    opener.classList.add('loading');
    opener.querySelector('.loading-overlay__spinner').classList.remove('hidden');

    fetch(opener.getAttribute('data-product-url'))
      .then((response) => response.text())
      .then((responseText) => {
        const responseHTML = new DOMParser().parseFromString(responseText, 'text/html');
        this.productElement = responseHTML.querySelector('section[id^="MainProduct-"]');
        this.preventDuplicatedIDs();
        this.removeDOMElements();
        this.setInnerHTML(this.modalContent, this.productElement.innerHTML);

        if (window.Shopify && Shopify.PaymentButton) {
          Shopify.PaymentButton.init();
        }
        if (window.ProductModel) window.ProductModel.loadShopifyXR();

        this.removeGalleryListSemantic();
        this.updateImageSizes();
        this.preventVariantURLSwitching();
        super.show(opener);
      })
      .finally(() => {
        opener.removeAttribute('aria-disabled');
        opener.classList.remove('loading');
        opener.querySelector('.loading-overlay__spinner').classList.add('hidden');
      });
  }

  setInnerHTML(element, html) {
    element.innerHTML = html;

    // Reinject the script tags to allow execution
    element.querySelectorAll('script').forEach((oldScriptTag) => {
      const newScriptTag = document.createElement('script');
      Array.from(oldScriptTag.attributes).forEach((attribute) => {
        newScriptTag.setAttribute(attribute.name, attribute.value);
      });
      newScriptTag.appendChild(document.createTextNode(oldScriptTag.innerHTML));
      oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
    });
  }

  preventVariantURLSwitching() {
    const variantPicker = this.modalContent.querySelector('variant-radios,variant-selects');
    if (!variantPicker) return;

    variantPicker.setAttribute('data-update-url', 'false');
  }

  removeDOMElements() {
    const pickupAvailability = this.productElement.querySelector('pickup-availability');
    if (pickupAvailability) pickupAvailability.remove();

    const productModal = this.productElement.querySelector('product-modal');
    if (productModal) productModal.remove();

    const modalDialog = this.productElement.querySelectorAll('modal-dialog');
    if (modalDialog) modalDialog.forEach((modal) => modal.remove());
  }

  preventDuplicatedIDs() {
    const sectionId = this.productElement.dataset.section;
    this.productElement.innerHTML = this.productElement.innerHTML.replaceAll(sectionId, `quickadd-${sectionId}`);
    this.productElement.querySelectorAll('variant-selects, variant-radios, product-info').forEach((element) => {
      element.dataset.originalSection = sectionId;
    });
  }

  removeGalleryListSemantic() {
    const galleryList = this.modalContent.querySelector('[id^="Slider-Gallery"]');
    if (galleryList) galleryList.setAttribute('role', 'presentation');
  }

  updateImageSizes() {
    const product = this.modalContent.querySelector('.product');
    const desktopColumns = product.classList.contains('product--columns');
    if (!desktopColumns) return;

    const mediaImages = product.querySelectorAll('.product__media img');
    if (!mediaImages.length) return;

    let mediaImageSizes = '(min-width: 1000px) 715px, (min-width: 750px) calc((100vw - 11.5rem) / 2), calc(100vw - 4rem)';

    if (product.classList.contains('product--medium')) {
      mediaImageSizes = mediaImageSizes.replace('715px', '605px');
    } else if (product.classList.contains('product--small')) {
      mediaImageSizes = mediaImageSizes.replace('715px', '495px');
    }

    mediaImages.forEach(img => img.setAttribute('sizes', mediaImageSizes));
  }
}

customElements.define('quick-add-modal', QuickAddModal);

class ProductModal extends ModalDialog {
  constructor() {
    super();
  }

  hide() {
    super.hide();
  }

  show(opener) {
    super.show(opener);
    this.showActiveMedia();
  }

  showActiveMedia() {
    this.querySelectorAll(`[id^="ProductModal-"] .product__media--variant`).forEach((variantMedia) => {
      variantMedia.classList.remove('product__media--variant');
    });
    const variantMedia = this.querySelector(`[id^="ProductModal-"] [data-media-id="${this.openedBy.getAttribute('data-media-id')}"]`);
    if (variantMedia) {
      const modalContent = variantMedia.closest('[id^="ProductModal-"]');
      modalContent.prepend(variantMedia);
      variantMedia.classList.add('product__media--variant');
      variantMedia.scrollIntoView();
    }
  }
}
customElements.define('product-modal', ProductModal);

// Product recommendations
class ProductRecommendations extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const handleIntersection = (entries, observer) => {
      if (!entries[0].isIntersecting) return;
      observer.unobserve(this);

      fetch(this.dataset.url)
        .then(response => response.text())
        .then(text => {
          const html = document.createElement('div');
          html.innerHTML = text;
          const recommendations = html.querySelector('product-recommendations');

          if (recommendations && recommendations.innerHTML.trim().length) {
            this.innerHTML = recommendations.innerHTML;
          }

          if (!this.querySelector('slideshow-component') && this.classList.contains('complementary-products')) {
            this.remove();
          }

          if (html.querySelector('.grid__item')) {
            this.classList.add('product-recommendations--loaded');
          }
        })
        .catch(e => {
          console.error(e);
        });
    };

    new IntersectionObserver(handleIntersection.bind(this), {rootMargin: '0px 0px 400px 0px'}).observe(this);
  }
}

customElements.define('product-recommendations', ProductRecommendations);