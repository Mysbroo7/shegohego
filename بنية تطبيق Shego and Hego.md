# بنية تطبيق Shego and Hego

## نظرة عامة
تطبيق تواصل اجتماعي متعدد المنصات (iOS, Android, Web) للفيديوهات القصيرة مع نظام متكامل للتفاعل والمتابعة.

## الألوان المستخدمة
- الأحمر: #FF4444
- البرتقالي: #FF8800
- الأصفر: #FFCC00
- الأبيض: #FFFFFF
- الرمادي الداكن: #1A1A1A

## المتطلبات التقنية

### Frontend (متعدد المنصات)
- **Framework**: React Native مع Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS + NativeWind
- **Video Player**: react-native-video
- **Camera**: expo-camera
- **Image Picker**: expo-image-picker

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Firebase Firestore (مجاني)
- **Authentication**: Firebase Auth
- **Storage**: Google Cloud Storage (مجاني)
- **Real-time**: Firebase Realtime Database
- **API**: RESTful + WebSocket

### خدمات Google Cloud (المجانية)
1. **Firebase Authentication**: تسجيل الدخول والمصادقة
2. **Cloud Firestore**: قاعدة البيانات
3. **Cloud Storage**: تخزين الفيديوهات والصور
4. **Cloud Functions**: معالجة الفيديوهات والإشعارات
5. **Cloud Messaging**: الإشعارات الفورية

## الميزات الأساسية

### 1. نظام المصادقة
- التسجيل بالبريد الإلكتروني والكلمة المرورية
- تسجيل الدخول بـ Google و Apple
- التحقق من البريد الإلكتروني
- استرجاع كلمة المرور
- ملف تعريف المستخدم

### 2. تحميل الفيديوهات
- التقاط الفيديو من الكاميرا
- اختيار من المعرض
- تحرير الفيديو (القص، التأثيرات، الموسيقى)
- إضافة الوصف والهاشتاجات
- اختيار الخصوصية (عام/خاص)

### 3. عرض الفيديوهات
- تمرير عمودي (Vertical Scroll)
- تشغيل تلقائي عند الظهور
- عرض معلومات المستخدم
- عرض عدد المشاهدات والإعجابات والتعليقات

### 4. التفاعل
- الإعجاب بالفيديو
- إضافة تعليقات
- الرد على التعليقات
- مشاركة الفيديو
- حفظ الفيديو

### 5. المتابعة والرسائل
- متابعة المستخدمين
- عرض المتابعين والمتابعات
- الرسائل المباشرة
- الإشعارات الفورية

### 6. الملف الشخصي
- عرض الفيديوهات الخاصة بالمستخدم
- إحصائيات (المتابعون، الإعجابات، المشاهدات)
- تعديل الملف الشخصي
- الإعدادات والخصوصية

## هيكل قاعدة البيانات

### Collections في Firestore
```
users/
  ├── userId
  │   ├── email
  │   ├── username
  │   ├── profileImage
  │   ├── bio
  │   ├── followers
  │   ├── following
  │   └── createdAt

videos/
  ├── videoId
  │   ├── userId
  │   ├── title
  │   ├── description
  │   ├── videoUrl
  │   ├── thumbnailUrl
  │   ├── likes
  │   ├── views
  │   ├── comments
  │   ├── shares
  │   ├── hashtags
  │   ├── privacy
  │   └── createdAt

comments/
  ├── commentId
  │   ├── videoId
  │   ├── userId
  │   ├── text
  │   ├── likes
  │   ├── replies
  │   └── createdAt

messages/
  ├── conversationId
  │   ├── participants
  │   ├── messages
  │   │   ├── messageId
  │   │   ├── senderId
  │   │   ├── text
  │   │   └── timestamp
  │   └── lastUpdated
```

## معايير الأمان
- تشفير كلمات المرور
- التحقق من الهوية قبل العمليات الحساسة
- حماية البيانات الشخصية
- عدم تخزين البيانات الحساسة محليًا
- استخدام HTTPS لجميع الاتصالات

## متطلبات النشر على Google Play
- توقيع APK بشهادة خاصة
- ملف الخصوصية والشروط
- صور ولقطات شاشة
- وصف التطبيق
- تصنيف المحتوى
- حساب Google Play Developer
