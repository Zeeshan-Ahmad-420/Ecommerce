import { XCircle, ArrowLeft, LifeBuoy } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PurchaseCancelPage = () => {
	return (
		<div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 to-gray-800">
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.4, ease: "easeOut" }}
				className="max-w-md w-full bg-gray-850 border border-gray-700 rounded-2xl shadow-2xl p-8 sm:p-10"
			>
				<div className="flex flex-col items-center text-center">
					<XCircle className="text-red-500 w-16 h-16 mb-4" />
					<h1 className="text-3xl font-bold text-red-400 mb-2">Purchase Cancelled</h1>
					<p className="text-gray-300 mb-6">
						No worries — your order wasn’t processed and you haven’t been charged.
					</p>

					<div className="bg-gray-750 rounded-lg p-4 w-full text-sm text-gray-400 mb-6 flex items-start gap-2">
						<LifeBuoy className="w-5 h-5 text-gray-500 mt-0.5" />
						<span>
							If you experienced any issues during checkout, our{" "}
							<span className="text-white font-medium">support team</span> is here to help.
						</span>
					</div>

					<Link
						to="/"
						className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
					>
						<ArrowLeft className="mr-2" size={18} />
						Return to Shop
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default PurchaseCancelPage;
