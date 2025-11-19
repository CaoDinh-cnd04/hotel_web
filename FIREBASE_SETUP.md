# Hướng dẫn cấu hình Firebase cho Google & Facebook Login

## Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" (Thêm dự án)
3. Đặt tên project (vd: "TripHotel")
4. Follow các bước và tạo project

## Bước 2: Thêm Web App

1. Trong Firebase Console, click biểu tượng "</>" (Web)
2. Đặt tên app nickname: "TripHotel Web"
3. Click "Register app"
4. Copy các giá trị `firebaseConfig` ra file `.env`

## Bước 3: Enable Google Authentication

1. Trong Firebase Console, vào **Authentication** > **Sign-in method**
2. Click **Google** trong danh sách providers
3. Click **Enable**
4. Chọn Support email
5. Click **Save**

## Bước 4: Enable Facebook Authentication

1. Tạo Facebook App tại [Facebook Developers](https://developers.facebook.com/)
2. Vào **Settings** > **Basic** copy **App ID** và **App Secret**
3. Quay lại Firebase Console > **Authentication** > **Sign-in method**
4. Click **Facebook**
5. Click **Enable**
6. Paste **App ID** và **App Secret** từ Facebook App
7. Copy **OAuth redirect URI** từ Firebase
8. Quay lại Facebook Developers:
   - Vào **Facebook Login** > **Settings**
   - Paste OAuth redirect URI vào **Valid OAuth Redirect URIs**
   - Save
9. Publish Facebook App (Settings > Basic > App Mode > Live)

## Bước 5: Cấu hình .env file

Copy `.env.example` thành `.env` và điền các giá trị:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=triphotel-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=triphotel-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=triphotel-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

## Bước 6: Test

1. Restart dev server: `npm run dev`
2. Truy cập trang login
3. Click nút "Google" hoặc "Facebook"
4. Đăng nhập và kiểm tra

## Lưu ý

- File `.env` đã được thêm vào `.gitignore` - không push lên Git
- Cần cấu hình CORS trên backend để cho phép Firebase auth
- Domain production cần thêm vào **Authorized domains** trong Firebase Console
