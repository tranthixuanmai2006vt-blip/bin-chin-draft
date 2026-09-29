# Bin và Chin hay đi linh tinh ♡

Website tĩnh (HTML + CSS + JS thuần), một trang dài, deploy bằng GitHub Pages.

## Cấu trúc
```
index.html          khung trang (thường không cần sửa)
style.css           giao diện & màu sắc
script.js           hiệu ứng
content/site.json   MỌI dòng chữ trên web (thư, lời cầu hôn, tên nút...)
content/memories.json  danh sách ảnh + caption
images/             bỏ ảnh vào đây
audio/              bỏ nhạc vào đây (song.mp3)
```

## Thay ảnh
Chép ảnh mới vào `images/` với **đúng tên cũ** (ví dụ `photo-01.jpg`) và chọn "Replace".

## Thêm ảnh
1. Bỏ file vào `images/` (ví dụ `photo-04.jpg`).
2. Mở `content/memories.json`, thêm một dòng (nhớ dấu phẩy giữa các dòng):
```json
{ "image": "images/photo-04.jpg", "caption": "Caption mới ♡", "date": "2026" }
```
Ảnh sẽ xuất hiện lần lượt theo thứ tự trong file khi nhạc phát. Ảnh nào chưa có file sẽ hiện ô trái tim.

### Chọn thời điểm ảnh hiện (tuỳ chọn)
Mặc định ảnh chia đều theo độ dài bài hát (15 ảnh / 4:05 ≈ 16 giây mỗi ảnh). Muốn ảnh hiện đúng câu hát, thêm `"time"` (tính bằng giây) vào **tất cả** ảnh, ví dụ:
```json
{ "image": "images/photo-01.jpg", "caption": "...", "date": "2026", "time": 0 },
{ "image": "images/photo-02.jpg", "caption": "...", "date": "2026", "time": 22 }
```
Ảnh đầu nên có `"time": 0`. Nếu chỉ thêm cho một vài ảnh thì web tự quay về cách chia đều.

## Sửa caption
Sửa `"caption"` / `"date"` trong `content/memories.json`.

## Sửa chữ
Mở `content/site.json`. Bức thư nằm ở `letter.paragraphs` (mỗi đoạn là một dòng trong ngoặc kép, `\n` là xuống dòng). Lời cầu hôn: `proposal.question`. Lời chúc khi bấm "Có": `proposal.yesTitle`, `proposal.yesText`. Khi bấm "Không thể không đồng ý": `proposal.noTitle`. Sau khi thổi nến: `cake.wishMessage`.
Lưu ý: giữ đúng dấu ngoặc kép `" "` và dấu phẩy; nếu muốn viết dấu `"` trong chữ thì gõ `\"`.

## Thêm nhạc
Chép bài hát vào `audio/` và đặt tên `song.mp3`. (Muốn tên khác: sửa `music.audio` trong `site.json`.) Chưa có file thì web hiện lời nhắn dễ thương, không bị lỗi. Nhạc không tự phát — phải bấm ▶.

## Chạy thử trên máy (PyCharm)
Web dùng `fetch` nên **không mở bằng file://**. Cách dễ nhất:
- Chuột phải `index.html` → **Open in → Browser** (PyCharm tự chạy server nhỏ), hoặc
- Mở Terminal của PyCharm, gõ `python -m http.server 8000` rồi vào http://localhost:8000

## Deploy: GitHub Pages
1. Đẩy project lên GitHub (index.html phải nằm ở thư mục gốc của repo).
2. Repo → **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main`, thư mục `/ (root)` → **Save**.
3. Chờ 1-3 phút, link dạng `https://<tên-github>.github.io/<tên-repo>/`.
Sau này chỉ cần commit & push, web tự cập nhật.
