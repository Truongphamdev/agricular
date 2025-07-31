# 🌱 Dự án Phân Tích Nông Nghiệp Thông Minh

> Một hệ thống hỗ trợ nhà nông trong việc nhận diện bệnh cây trồng và tối ưu hoá sản xuất nông nghiệp bằng công nghệ AI.

---

## 📌 Mục tiêu dự án

- Phát hiện và phân loại **bệnh trên cây trồng** thông qua hình ảnh.
- Gợi ý **giải pháp xử lý** phù hợp cho từng loại bệnh.
- Hỗ trợ nông dân bằng công nghệ đơn giản, dễ tiếp cận.

---

## 🛠️ Công nghệ sử dụng

- **Frontend**: ReactJS + TailwindCSS  
- **Backend**: Django REST Framework   
- **Cơ sở dữ liệu**: PostgreSQL  
- **AI**: Clarifai API
- **Lưu trữ ảnh**: Cloudinary  


---

## 📷 Tính năng chính

- 📸 Nhận diện bệnh từ ảnh chụp lá/cây trồng
- 💡 Đề xuất hướng xử lý (phun thuốc, loại bỏ lá, …)
- 🔍 Tìm kiếm nhanh kiến thức về từng loại bệnh
- 📊 Thống kê và theo dõi lịch sử bệnh cây

---

## 🚀 Hướng dẫn chạy dự án

### Cài đặt frontend (React)
```bash
cd client
npm install
npm start
```

### Cài đặt backend (Django)

```bash
cd server
pip install -r requirements.txt
python manage.py runserver
```

