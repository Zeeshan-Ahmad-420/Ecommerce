import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore.js"
import {useCartStore} from "../stores/useCartStore.js";


const Navbar = () => {
    const {user,logout} = useUserStore();
    const isAdmin = user?.role === 'admin';
   const {cart} =useCartStore()

    return (
        <header className="fixed top-0 left-0 w-full bg-gray-900/90 backdrop-blur-md shadow-md z-50 border-b border-emerald-700">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <Link
                        to="/"
                        className="flex items-center space-x-3 group"
                        aria-label="Homepage"
                    >
                        <div className="p-2 rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 shadow group-hover:rotate-12 transition-transform duration-300">
                            <ShoppingCart className="w-6 h-6 text-white" />
                        </div>
                        <span
                            className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-700  to-green-300 bg-[length:200%_200%] animate-shine"
                        >
                            E-Commerce
                        </span>

                    </Link>


                    <nav className="flex flex-wrap items-center gap-4 text-white text-sm sm:text-base font-medium">
                        <Link
                            to="/"
                            className="hover:text-emerald-400 transition duration-300"
                        >
                            Home
                        </Link>

                        {user && (
                            <Link
                                to="/cart"
                                className="relative group hover:text-emerald-400 transition duration-300 flex items-center"
                            >
                                <ShoppingCart className="mr-1" size={20} />
                                <span className="hidden sm:inline">Cart</span>
                               {cart.length >0 &&( 
                                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    {cart.length}
                                </span>
                            )}
                            </Link>
                        )}

                        {isAdmin && (
                            <Link
                                to="/secret-dashboard"
                                className="flex items-center bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-md transition"
                              
                            >
                                <Lock size={18} className="mr-2" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>
                        )}

                        {user ? (
                            <button className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-md transition"
                            onClick={logout}>
                                <LogOut size={18} />
                                <span className="ml-2 hidden sm:inline">Log Out</span>
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/signup"
                                    className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md transition"
                                >
                                    <UserPlus size={18} className="mr-2" />
                                    Sign Up
                                </Link>

                                <Link
                                    to="/login"
                                    className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-md transition"
                                >
                                    <LogIn size={18} className="mr-2" />
                                    Login
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
