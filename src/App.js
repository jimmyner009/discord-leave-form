import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

function App() {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(null); // type: Date
  const [endDate, setEndDate] = useState(null);     // type: Date
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      alert("กรุณาเลือกวันที่ให้ครบ");
      return;
    }

    const dateRange = `${format(startDate, 'dd/MM/yyyy')} ถึง ${format(endDate, 'dd/MM/yyyy')}`;
    const payload = { name, date: dateRange, reason };

    setLoading(true);
    try {
      await fetch('https://discord-leave-backend.onrender.com/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setSubmitted(true);
      setName('');
      setStartDate(null);
      setEndDate(null);
      setReason('');
    } catch (error) {
      alert('❌ ส่งไม่สำเร็จ กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">📝 ฟอร์มลาแก๊ง</h2>

        {submitted ? (
          <div className="text-center text-green-600 font-semibold">
            ✅ ส่งฟอร์มเรียบร้อยแล้ว!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ชื่อ */}
            <div>
              <label className="block text-sm font-medium text-gray-700">ชื่อ</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* วันที่ลา */}
            <div>
              <label className="block text-sm font-medium text-gray-700">วันที่ลา</label>
              <div className="flex space-x-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="วันเริ่มลา"
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                />
                <span className="text-sm text-gray-500 flex items-center">ถึง</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="วันสิ้นสุด"
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                />
              </div>
            </div>

            {/* เหตุผล */}
            <div>
              <label className="block text-sm font-medium text-gray-700">เหตุผล</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows="4"
                className="mt-1 w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* ปุ่มส่ง */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'กำลังส่ง...' : 'ส่งฟอร์ม'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
