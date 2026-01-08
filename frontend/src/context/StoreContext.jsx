import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { food_list as staticFoodList } 
from "../assets/frontend_assets/assets";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url =  "http://localhost:4000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

 const addToCart = (itemId) => {
  const id = itemId.toString();

  setCartItems((prev) => {
    const prevItems = prev || {};
    return {
      ...prevItems,
      [id]: (prevItems[id] || 0) + 1,
    };
  });
};

const removeFromCart = (itemId) => {
  const id = itemId.toString();

  setCartItems((prev) => {
    if (!prev || !prev[id]) return prev;

    const updated = { ...prev };

    if (updated[id] === 1) {
      delete updated[id];
    } else {
      updated[id] -= 1;
    }

    return updated;
  });
};

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

 const fetchFoodList = async () => {
  setFoodList(staticFoodList);
};

  const loadCardData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } }
    );
    setCartItems(response.data.cartData);
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCardData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
