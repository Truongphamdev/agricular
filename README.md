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
### 📁 Cấu trúc thư mục
```bash
agriculture/
│
├── client/              
│   └── src/
├── server/              
│   └── disease_app/             
└── README.md
```

### 📬 Liên hệ
Mọi đóng góp hoặc góp ý vui lòng gửi về truongnguyen01653@gmail.com

### 📄 Giấy phép
MIT License

Copyright (c) 2025 Trường Nguyễn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



