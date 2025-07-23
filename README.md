# Convenience Store Ordering System

This is a web application for browsing and ordering items from a convenience store. Users can browse products, view details, add items to their cart, and place an order.

## Development Setup

This project includes helper scripts to streamline the development setup process.

### 1. Database Setup and Seeding

Before running the application for the first time, you need to set up the database schema and populate it with initial data.

This can be done by running the `setup_and_seed.py` script from the project root:

```bash
python setup_and_seed.py
```

This script will:
1.  Execute `backend/public/setup.php` to create the necessary database tables.
2.  Execute `php spark db:seed DatabaseSeeder` to seed the database with initial data.

**Note:** You only need to run this script once, or whenever there are changes to the database schema or seeders.

### 2. Running the Development Servers

To start the backend and frontend development servers simultaneously, use the `run_dev.py` script:

```bash
python run_dev.py
```

This will open two new terminal windows:
-   One for the **Backend Server** (CodeIgniter) running `php spark serve`.
-   One for the **Frontend Server** (React) running `npm start`.

To stop the servers, simply close their respective terminal windows.

## Features

- 🏠 **Home Page**: Displays featured products and special offers.
- 🛍️ **Products Page**: Browse all available items with filtering and sorting options.
- 📄 **Product Details**: View detailed information about a specific item.
- 🛒 **Cart**: Add and remove items from the shopping cart.
- 📜 **Order History**: View past orders and track current ones.
- ❤️ **Favorites**: Save items for easy reordering.
- ⭐ **Product Ratings & Comments**: View and leave feedback on products.
- 📱💻 **Modern & Responsive UI**: A clean interface that works on all devices.

> **Note**: Some features are currently in development and will be available in future updates.

## Screenshots (outdated images)

<div align="center">

<table width="100%">
  <tr>
    <td align="center" valign="top" width="33%">
      <img src="./images/Homepage.png" alt="Homepage" width="100%">
      <br>
      <b>Home Page</b>
    </td>
    <td align="center" valign="top" width="33%">
      <img src="./images/Productpage.png" alt="Product Page" width="100%">
      <br>
      <b>Product Page</b>
    </td>
    <td align="center" valign="top" width="33%">
      <img src="./images/AllProducts.png" alt="All Products" width="100%">
      <br>
      <b>All Products</b>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top" width="33%">
      <img src="./images/Categories.png" alt="Categories" width="100%">
      <br>
      <b>Categories</b>
    </td>
    <td align="center" valign="top" width="33%">
      <img src="./images/NavbarUi.png" alt="Navbar" width="100%">
      <br>
      <b>Navbar</b>
    </td>
    <td align="center" valign="top" width="33%">
      <img src="./images/Footer.png" alt="Footer" width="100%">
      <br>
      <b>Footer</b>
    </td>
  </tr>
</table>

</div>

## Tech Stack

This project is built with a modern, multi-platform stack:

<p align="center">
  <a href="https://reactjs.org/" target="_blank">
    <img src="https://img.shields.io/badge/-ReactJs-61DAFB?logo=react&logoColor=white&style=for-the-badge" alt="React.js">
  </a>
  <a href="https://codeigniter.com/" target="_blank">
    <img src="https://img.shields.io/badge/-CodeIgniter-EF4223?logo=codeigniter&logoColor=white&style=for-the-badge" alt="CodeIgniter">
  </a>
  <a href="https://reactnative.dev/" target="_blank">
    <img src="https://img.shields.io/badge/-React_Native-61DAFB?logo=react&logoColor=white&style=for-the-badge" alt="React Native">
  </a>
</p>

- **Frontend**: A responsive web interface built with **React.js**.
- **Backend**: A robust API powered by **CodeIgniter 4**.
- **Mobile**: A cross-platform mobile app developed with **React Native**.

> **Database**: The database schema and integration are planned for a future update.

## Client Dashboard

<div align="center">

<table width="100%">
  <tr>
    <td align="center" valign="top" width="50%">
      <img src="./images/clientdashboard.png" alt="Client Dashboard" width="100%">
      <br>
      <b>Client Dashboard</b>
    </td>
    <td align="center" valign="top" width="50%">
      <img src="./images/clientorders.png" alt="Client Orders" width="100%">
      <br>
      <b>Client Orders</b>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top" width="50%">
      <img src="./images/clientstore.png" alt="Client Store" width="100%">
      <br>
      <b>Client Store</b>
    </td>
    <td align="center" valign="top" width="50%">
      <img src="./images/clientreview.png" alt="Client Reviews" width="100%">
      <br>
      <b>Client Reviews</b>
    </td>
  </tr>
</table>

</div>

> **Note**: Client Dashboard is currently desktop-only, mobile version is in development.
