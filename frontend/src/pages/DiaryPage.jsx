import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronLeft, ChevronRight, Trash2, Edit } from "lucide-react";

function DiaryPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState({});
  const [editingEvent, setEditingEvent] = useState(null); // 수정 중인 메모

  // 월 이동
  const handleMonthChange = (dir) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + dir);
    setCurrentDate(newDate);
  };

  // 달력 날짜 배열 생성 (6주=42칸 고정)
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    while (days.length < 42) days.push(null);
    return days;
  };

  // 이벤트 저장 (추가/수정 겸용)
  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEvent = {
      name: formData.get("name"),
      content: formData.get("content"),
      plant: formData.get("plant"),
    };

    const dateKey = selectedDate.toISOString().split("T")[0];

    if (editingEvent !== null) {
      // 수정
      const updated = [...events[dateKey]];
      updated[editingEvent] = newEvent;
      setEvents({ ...events, [dateKey]: updated });
      setEditingEvent(null);
    } else {
      // 추가
      setEvents({
        ...events,
        [dateKey]: [...(events[dateKey] || []), newEvent],
      });
    }

    setShowModal(false);
  };

  // 메모 삭제
  const handleDelete = (dateKey, idx) => {
    const updated = events[dateKey].filter((_, i) => i !== idx);
    setEvents({ ...events, [dateKey]: updated });
  };

  const plants = [
    { name: "Rose", color: "bg-red-400" },
    { name: "Lily", color: "bg-yellow-400" },
    { name: "Cactus", color: "bg-green-500" },
    { name: "Tulip", color: "bg-pink-400" },
  ];

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => handleMonthChange(-1)}>
          <ChevronLeft size={28} />
        </button>
        <h2 className="text-xl font-bold">
          {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {currentDate.getFullYear()}
        </h2>
        <button onClick={() => handleMonthChange(1)}>
          <ChevronRight size={28} />
        </button>
      </div>

      {/* 달력 */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="font-medium text-gray-600">
            {d}
          </div>
        ))}
        {getCalendarDays().map((day, idx) => {
          const dateKey = day
            ? `${currentDate.getFullYear()}-${String(
                currentDate.getMonth() + 1
              ).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            : null;

          return (
            <div
              key={idx}
              className={`h-16 flex flex-col items-center justify-center border rounded-lg cursor-pointer relative ${
                day ? "hover:bg-green-100" : "bg-gray-50"
              }`}
              onClick={() =>
                day &&
                setSelectedDate(
                  new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                )
              }
            >
              {day}
              {/* 이벤트 점 표시 */}
              {day && events[dateKey] && events[dateKey].length > 0 && (
                <span className="absolute bottom-1 w-2 h-2 rounded-full bg-green-500"></span>
              )}
            </div>
          );
        })}
      </div>

      {/* 선택된 날짜 메모 표시 */}
      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">
            {formatDate(selectedDate)} 메모
          </h3>
          {events[formatDate(selectedDate)] &&
          events[formatDate(selectedDate)].length > 0 ? (
            <ul className="space-y-2">
              {events[formatDate(selectedDate)].map((event, idx) => (
                <li
                  key={idx}
                  className="p-3 border rounded-lg shadow-sm bg-gray-50 flex justify-between items-start"
                >
                  <div>
                    <p className="font-bold">{event.name}</p>
                    <p className="text-sm text-gray-600">{event.content}</p>
                    {event.plant && (
                      <span className="inline-block mt-1 text-xs bg-green-200 px-2 py-1 rounded-full">
                        🌱 {event.plant}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingEvent(idx);
                        setShowModal(true);
                      }}
                      className="text-blue-500"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(formatDate(selectedDate), idx)
                      }
                      className="text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">메모가 없습니다.</p>
          )}
        </div>
      )}

      {/* + 버튼 */}
      {selectedDate && (
        <motion.button
          onClick={() => {
            setEditingEvent(null);
            setShowModal(true);
          }}
          className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-xl"
          whileHover={{ scale: 1.1 }}
        >
          <Plus size={28} />
        </motion.button>
      )}

      {/* Add/Edit Memo Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed bottom-0 left-0 w-full bg-white p-6 rounded-t-2xl shadow-xl"
          >
            <h3 className="text-lg font-semibold mb-4">
              {editingEvent !== null ? "Edit Memo" : "Add New Memo"}
            </h3>
            <form onSubmit={handleSave} className="space-y-3">
              <input
                name="name"
                placeholder="Event name"
                className="w-full border p-2 rounded"
                defaultValue={
                  editingEvent !== null
                    ? events[formatDate(selectedDate)][editingEvent].name
                    : ""
                }
                required
              />
              <textarea
                name="content"
                placeholder="Contents"
                className="w-full border p-2 rounded h-24"
                defaultValue={
                  editingEvent !== null
                    ? events[formatDate(selectedDate)][editingEvent].content
                    : ""
                }
                required
              />
              <input
                name="plant"
                placeholder="Plant name"
                className="w-full border p-2 rounded"
                defaultValue={
                  editingEvent !== null
                    ? events[formatDate(selectedDate)][editingEvent].plant
                    : ""
                }
              />

              {/* 등록된 식물 동그라미 */}
              <div className="flex gap-3">
                {plants.map((p) => (
                  <label
                    key={p.name}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="plant"
                      value={p.name}
                      className="hidden peer"
                      defaultChecked={
                        editingEvent !== null &&
                        events[formatDate(selectedDate)][editingEvent].plant ===
                          p.name
                      }
                    />
                    <span
                      className={`w-8 h-8 rounded-full ${p.color} peer-checked:ring-4 ring-green-400`}
                    ></span>
                    <span className="text-xs mt-1">{p.name}</span>
                  </label>
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white p-2 rounded-lg font-medium"
              >
                {editingEvent !== null ? "수정 완료" : "등록"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DiaryPage;
