// import Product from "../models/product.model.js";

// export const getCartProducts = async (req, res) => {
// 	try {
// 		const products = await Product.find({ _id: { $in: req.user.cartItems } });

// 		// add quantity for each product
// 		const cartItems = products.map((product) => {
// 			const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
// 			return { ...product.toJSON(), quantity: item.quantity };
// 		});

// 		res.json(cartItems);
// 	} catch (error) {
// 		console.log("Error in getCartProducts controller", error.message);
// 		res.status(500).json({ message: "Server error", error: error.message });
// 	}
// };

// export const addToCart = async (req, res) => {
// 	try {
// 		const { productId } = req.body;
// 		const user = req.user;

// 		const existingItem = user.cartItems.find((item) => item.id === productId);
// 		if (existingItem) {
// 			existingItem.quantity += 1;
// 		} else {
// 			user.cartItems.push(productId);
// 		}

// 		await user.save();
// 		res.json(user.cartItems);
// 	} catch (error) {
// 		console.log("Error in addToCart controller", error.message);
// 		res.status(500).json({ message: "Server error", error: error.message });
// 	}
// };

// export const removeAllFromCart = async (req, res) => {
// 	try {
// 		const { productId } = req.body;
// 		const user = req.user;
// 		if (!productId) {
// 			user.cartItems = [];
// 		} else {
// 			user.cartItems = user.cartItems.filter((item) => item.id !== productId);
// 		}
// 		await user.save();
// 		res.json(user.cartItems);
// 	} catch (error) {
// 		res.status(500).json({ message: "Server error", error: error.message });
// 	}
// };

// export const updateQuantity = async (req, res) => {
// 	try {
// 		const { id: productId } = req.params;
// 		const { quantity } = req.body;
// 		const user = req.user;
// 		const existingItem = user.cartItems.find((item) => item.id === productId);

// 		if (existingItem) {
// 			if (quantity === 0) {
// 				user.cartItems = user.cartItems.filter((item) => item.id !== productId);
// 				await user.save();
// 				return res.json(user.cartItems);
// 			}

// 			existingItem.quantity = quantity;
// 			await user.save();
// 			res.json(user.cartItems);
// 		} else {
// 			res.status(404).json({ message: "Product not found" });
// 		}
// 	} catch (error) {
// 		console.log("Error in updateQuantity controller", error.message);
// 		res.status(500).json({ message: "Server error", error: error.message });
// 	}
// };


import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
  try {
    const cartItems = await Promise.all(
      req.user.cartItem.map(async (item) => {
        const product = await Product.findById(item.product);
        return {
          ...product.toObject(),
          quantity: item.quantity,
        };
      })
    );
    res.json(cartItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existing = user.cartItem.find(
      (item) => item.product.toString() === productId
    );
    if (existing) existing.quantity += 1;
    else user.cartItem.push({ product: productId, quantity: 1 });

    await user.save();
    res.json(user.cartItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) user.cartItem = [];
    else user.cartItem = user.cartItem.filter(
      (i) => i.product.toString() !== productId
    );

    await user.save();
    res.json(user.cartItem);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    const existing = user.cartItem.find(
      (item) => item.product.toString() === productId
    );
    if (!existing) return res.status(404).json({ message: "Product not found" });

    if (quantity === 0) {
      user.cartItem = user.cartItem.filter((i) => i.product.toString() !== productId);
    } else {
      existing.quantity = quantity;
    }

    await user.save();
    res.json(user.cartItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
