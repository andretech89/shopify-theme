// Simple pub/sub system for theme communication

const PUB_SUB_EVENTS = {
  cartUpdate: 'cart-update',
  quantityUpdate: 'quantity-update', 
  variantChange: 'variant-change',
  cartError: 'cart-error',
  modalOpened: 'modal-opened',
  modalClosed: 'modal-closed',
  slideChanged: 'slide-changed'
};

let subscribers = {};

function subscribe(eventName, callback) {
  if (subscribers[eventName] === undefined) {
    subscribers[eventName] = [];
  }

  subscribers[eventName] = [...subscribers[eventName], callback];

  return function unsubscribe() {
    subscribers[eventName] = subscribers[eventName].filter((cb) => {
      return cb !== callback;
    });
  };
}

function publish(eventName, data) {
  if (subscribers[eventName]) {
    subscribers[eventName].forEach((callback) => {
      callback(data);
    });
  }
}

// Make available globally
window.subscribe = subscribe;
window.publish = publish;
window.PUB_SUB_EVENTS = PUB_SUB_EVENTS;