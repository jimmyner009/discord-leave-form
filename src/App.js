import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isBefore } from "date-fns";
import { motion } from "framer-motion";

function App() {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const isDateInvalid = endDate && startDate && isBefore(endDate, startDate);
  const isFormValid =
    name.trim() && reason.trim() && startDate && endDate && !isDateInvalid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dateRange = `${format(startDate, "dd/MM/yyyy")} ถึง ${format(
      endDate,
      "dd/MM/yyyy"
    )}`;
    const payload = { name, date: dateRange, reason };

    setLoading(true);
    try {
      await fetch("https://discord-leave-backend.onrender.com/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setSubmitted(true);
      setName("");
      setStartDate(null);
      setEndDate(null);
      setReason("");
    } catch (error) {
      alert("❌ ส่งไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/60 backdrop-blur p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        {/* โลโก้ */}
        <div className="flex justify-center mb-4">
          <motion.img
            src="/LOGO_1E1.png"
            alt="โลโก้"
            className="h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 object-contain"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </div>

        {/* หัวข้อ */}
        <motion.h2
          className="text-2xl font-bold mb-6 text-center text-indigo-700 drop-shadow"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          📝 ฟอร์มลาแก๊ง
        </motion.h2>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: [1, 1.05, 1] }}
            transition={{ duration: 0.8, ease: "easeInOut", repeat: Infinity }}
            className="text-center text-green-600 font-semibold"
          >
            ✅ ส่งฟอร์มเรียบร้อยแล้ว!
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {},
            }}
          >
            {/* ชื่อ */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <label className="block text-sm font-medium text-gray-800">
                ชื่อ
              </label>
              <motion.input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="mt-1 w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80"
              />
            </motion.div>

            {/* วันที่ลา */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <label className="block text-sm font-medium text-gray-800">
                วันที่ลา
              </label>
              <div className="flex space-x-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    if (endDate && isBefore(endDate, date)) {
                      setEndDate(null);
                    }
                  }}
                  dateFormat="dd/MM/yyyy"
                  minDate={today}
                  placeholderText="วันเริ่มลา"
                  onFocus={(e) => e.target.blur()}
                  className="w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 transition duration-300"
                />
                <span className="text-sm text-gray-500 flex items-center">
                  ถึง
                </span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  minDate={today}
                  placeholderText="วันสิ้นสุด"
                  onFocus={(e) => e.target.blur()}
                  className="w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 transition duration-300"
                />
              </div>
              {isDateInvalid && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-red-500 text-sm mt-1"
                >
                  ❗ วันที่สิ้นสุดต้องหลังจากวันเริ่มต้น
                </motion.p>
              )}
            </motion.div>

            {/* เหตุผล */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <label className="block text-sm font-medium text-gray-800">
                เหตุผล
              </label>
              <motion.textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows="4"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="mt-1 w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 transition duration-300"
              />
            </motion.div>

            {/* ปุ่มส่ง */}
            <motion.button
              type="submit"
              disabled={loading || !isFormValid}
              whileHover={{ scale: 1.05, rotate: [-1, 1, 0] }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "tween", duration: 0.3 }} // ✅ แก้ตรงนี้
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-semibold shadow-md"
            >
              {loading ? "กำลังส่ง..." : "ส่งฟอร์ม"}
            </motion.button>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
}

export default App;
