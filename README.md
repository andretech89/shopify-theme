# Synthify Goods Shopify Theme

A futuristic, modern Shopify theme designed for tech gadget stores using tradelle.io for product fulfillment.

## 🚀 Features

- **Futuristic Design**: Dark theme with cyan accents and glassmorphism effects
- **Video Backgrounds**: Dynamic video banners for enhanced visual appeal
- **Responsive Layout**: Fully responsive across all devices
- **Product Gallery**: Interactive product image galleries with thumbnails
- **Animated Search**: Smooth search functionality with suggestions
- **Cart Integration**: Full cart functionality with notifications
- **tradelle.io Ready**: Optimized for dropshipping with tradelle.io
- **Modern Animations**: Smooth animations and hover effects

## 🎨 Design System

### Colors
- **Primary**: `#0A0A0A` (Near Black)
- **Secondary**: `#F5F5F5` (Off White)  
- **Accent**: `#00FFFF` (Electric Cyan)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 900

## 📁 File Structure

```
my-shopify-theme/
├── assets/
│   ├── global.css              # Universal styles
│   ├── homepage.css            # Homepage-specific styles
│   ├── homepage.js             # Homepage functionality
│   ├── product-page.css        # Product page styles
│   └── product-page.js         # Product page functionality
├── config/
│   ├── settings_schema.json    # Theme customization options
│   └── settings_data.json      # Default settings
├── layout/
│   └── theme.liquid            # Main layout template
├── sections/
│   └── product-highlight-video.liquid  # Product video section
├── snippets/
│   └── animated-search.liquid  # Search component
├── templates/
│   ├── index.liquid            # Homepage template
│   └── product.liquid          # Product page template
└── README.md
```

## 🛠 Installation

1. **Upload Assets**: First upload all required media files to Shopify Files:
   - `synthify-goods-logo.png`
   - `synthify-goods-homepage-banner.mp4` 
   - `synthify-goods-featured-product.mp4`

2. **Create Theme**: 
   - Go to Online Store → Themes
   - Add theme → Develop theme
   - Name: "Synthify Goods Custom Theme"

3. **Add Files**: Copy all files from this repository to your Shopify theme editor following the exact file structure.

4. **Install tradelle.io**: Install the tradelle.io app from Shopify App Store for product fulfillment.

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🔧 Customization

### Theme Settings
Access theme customization through:
**Online Store → Themes → Customize**

Available settings:
- Colors (Primary, Secondary, Accent)
- Typography (Body Font, Heading Font)
- Homepage Hero Section
- Product Page Settings
- Social Media Links

### Adding Products
1. Install tradelle.io app
2. Import products from their catalog
3. Organize into collections as needed
4. Products automatically work with the theme

## 🎯 Key Components

### Homepage
- **Hero Video Banner**: Full-screen video with call-to-action
- **Featured Products Grid**: Dynamic grid showing imported products
- **Collections**: Automatic collection display if created

### Product Pages  
- **Video Header**: Product highlight video section
- **Image Gallery**: Main image with thumbnail navigation
- **Variant Selection**: Radio button variant picker
- **Quantity Selector**: Plus/minus quantity controls
- **Add to Cart**: Ajax cart functionality with notifications

### Search
- **Animated Search Bar**: Glassmorphism design with suggestions
- **Popular Searches**: Predefined search terms
- **Real-time Results**: Live search functionality

## 🚚 tradelle.io Integration

This theme is optimized for tradelle.io dropshipping:

1. **Product Import**: Seamlessly import products with images and descriptions
2. **Automatic Fulfillment**: Orders automatically sync to tradelle.io
3. **Inventory Management**: Real-time stock updates
4. **Order Tracking**: Integrated tracking information

## 🎨 Brand Identity

**Synthify Goods** - "Curating Tomorrow's Gadgets"

- **Target Audience**: Tech-savvy millennials and Gen Z (18-35)
- **Brand Voice**: Futuristic, Aspirational, Witty, Clear
- **Visual Style**: Minimalist, High-contrast, Glowing accents

## 📞 Support

For theme support and customization:
- Create an issue in this repository
- Check the Shopify theme documentation
- Refer to tradelle.io documentation for fulfillment setup

## 📄 License

This theme is created for educational and commercial use. Please ensure compliance with Shopify's theme development guidelines.

---

**Built with ❤️ for the future of e-commerce**