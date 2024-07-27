// // src/components/Home/Home.js

import style from "./Home.module.css";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { FcBusinessman, FcBusinesswoman, FcElectronics } from "react-icons/fc";
import { GiGemChain } from "react-icons/gi";

import LoadingSpinner from "../../pages/Spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, setLoadingProductId } from "../../redux/reducers/ProductReducer";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/reducers/cartReducer";

function Home() {
  const { products, loading, loadingProductId } = useSelector((state) => state.products);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState(100000);
  const dispatch = useDispatch();
  const {user} = useSelector(state=>state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);


  // setting search query
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // setting category
  const handleCategoryChange = (e) => {
    const category = e.target.name;
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((c) => c !== category)
        : [...prevCategories, category]
    );
  };

  // setting price
  const handlePriceRangeChange = (e) => {
    setPriceRange(e.target.value);
  };

  // Adding Product to Cart
  const handleAddToCart = async (product) => {
    console.log('Product:', product);
    console.log('User:', user);
    console.log('PRODUCT ID:', product.id);
    console.log('Product Quantity:', product.quantity);
  
    if (!user) {
      toast.error("🔒 Please sign in to add items to your cart.");
      navigate("/signin");
      return;
    }
    try {
      dispatch(setLoadingProductId(product.id));
      const resultAction = await dispatch(addToCart({ user, product }));
      if (addToCart.rejected.match(resultAction)) {
        throw new Error(resultAction.payload);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error.message);
      toast.error(`Error adding item to cart: ${error.message}`);
    } finally {
      dispatch(setLoadingProductId(null));
    }
  };
  // Filter Products based on search, categories and prices
  const filteredProducts = products.filter((product) => {
    const matchesSearchQuery = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length
      ? selectedCategories.includes(product.category)
      : true;
    const matchesPriceRange = product.price <= priceRange;
    return matchesSearchQuery && matchesCategory && matchesPriceRange;
  });

  return (
    <>
      <div className={style.homePageContainer}>
        {/* Aside */}
        <aside className={style.filterContainer}>
          <h2>Filter</h2>
          <form>
            <label htmlFor="price">Price: &#8377;{priceRange}</label>
            <input
              type="range"
              id="price"
              name="price"
              min="10"
              max="100000"
              className={style.priceRange}
              step="1"
              value={priceRange}
              onChange={handlePriceRangeChange}
            />
            <h2>Category</h2>
            <div className={style.categoryContainer}>
              {/* Mens Fashion */}
              <div>
                <input
                  type="checkbox"
                  name="mensFashion"
                  id="mensFashion"
                  onChange={handleCategoryChange}
                />
                <label htmlFor="mensFashion">
                  <FcBusinessman />
                  mensFashion
                </label>
              </div>
              {/* Womens Fashion */}
              <div>
                <input
                  type="checkbox"
                  name="womensFashion"
                  id="womensFashion"
                  onChange={handleCategoryChange}
                />
                <label htmlFor="womensFashion">
                  <FcBusinesswoman />
                  womensFashion
                </label>
              </div>
              {/* Jewelery */}
              <div>
                <input
                  type="checkbox"
                  name="Jewellery"
                  id="Jewellery"
                  onChange={handleCategoryChange}
                />
                <label htmlFor="Jewellery">
                  <GiGemChain />
                  Jewellery
                </label>
              </div>
              {/* Electronics */}
              <div>
                <input
                  type="checkbox"
                  name="Electronics"
                  id="Electronics"
                  onChange={handleCategoryChange}
                />
                <label htmlFor="Electronics">
                  <FcElectronics />
                  Electronics
                </label>
              </div>
            </div>
          </form>
        </aside>
        {/* Search */}
        <form className={style.search}>
          <input
            type="search"
            placeholder="Search By Name"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </form>
      </div>
      {/* Product */}
      <div className={style.productGridContainer}>
        {loading && <LoadingSpinner />}
        {filteredProducts.map((product) => (
          <div className={style.productContainer} key={product.id}>
            <div className={style.productImageContainer}>
              <img
                src={product.imageUrl}
                alt="productImage"
                width="100%"
                height="100%"
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className={style.productDetails}>
              <div className={style.productName}>
                <p>{product.title}</p>
              </div>
              <div className={style.productOptions}>
                <p>&#8377;{product.price}</p>
              </div>
            </div>
            <button
              className={style.addCartBtn}
              onClick={() => handleAddToCart(product)}
              disabled={loadingProductId === product.id}
            >
              {loadingProductId === product.id ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
