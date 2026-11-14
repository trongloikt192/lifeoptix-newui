# Daily Log – UI kit mockup (ReactJS)

Mockup ReactJS (Vite + TypeScript) cho app Daily Log: màn **Today**, 15 overlay (bottom sheet, dialog, picker, toast, xin quyền), 13 component dùng chung, 16 loại card và 6 nhóm trạng thái giao diện.
Mã được viết theo "hình dạng" React Native để chuyển sang **RN 0.83 (bare)** gần như nguyên văn.

**Phong cách theo mockup gốc** ở [`trongloikt192/lifeoptix-newui/rn-decor`](https://github.com/trongloikt192/lifeoptix-newui/tree/main/rn-decor), đặt cạnh thư mục này trong repo; `ui-kit/reference` là symlink tới `../rn-decor`:
nền giấy kem, thẻ viền ô liu mảnh, nút xanh rêu có gờ đậm phía dưới, cành lá và hoa màu nước bám mép thẻ và góc màn hình.
Toàn bộ hoạ tiết và toạ độ neo lấy thẳng từ `reference/src/decor/*`; UI Kit không tự cắt thêm ảnh nào.

```bash
cd ui-kit
```

```bash
npm install
```

```bash
npm run dev
```

Mở trang, chọn mục ở cột trái (hoặc ô "Mockup" trên điện thoại), rồi chọn biến thể phía trên khung máy.
Mỗi mục có đường dẫn riêng, ví dụ `#/edit-entry/sleep`, `#/keyboard/amount`.
Khi đóng một sheet, bấm **Show it again** hoặc **Reset** để mở lại.

## Có gì trong gallery

| Nhóm | Mục |
| --- | --- |
| Mockup screens | 10 màn của gói gốc chạy thật bằng react-native-web: Today, How was your day?, Review entry, All entries, Weekly goals, Event reminders, Garden, Reports, AI Coach, Menu |
| Sheets & overlays | Add entry (viết, ghi âm, chọn loại) · Edit entry (bữa ăn, chi tiêu, thu nhập, vận động, giấc ngủ) · Filter · Entry detail · Goal · Event (âm/dương) · Reminders · Badge · Action sheet “…” · Confirmation dialog · Date / range picker (có âm lịch) · Time picker (giờ ghi chép, giờ nhắc, giờ ngủ) · Selection sheet (ngôn ngữ, giao diện, danh mục) · Toast · Permission prompt |
| Shared components | Button · Text field / area · Search bar · Filter chip · Segmented · Switch / Checkbox / Radio · Entry card · Goal card + progress · Event card · Metric card · Badge / status pill · App bar + tab bar · Microphone control |
| Cards | Entry · Review Entry (ước tính, cần kiểm tra, đã sửa) · Metric · Energy Summary · Money Summary · Goal (nguồn tạo, menu “…”) · Goals Summary · Event (sắp đến, hôm nay, đã qua, nút nhắc) · Calendar Summary (âm lịch, mùng 1, rằm) · Report · Insight (tích cực, cần chú ý, mối liên hệ) · Advice · Garden · Badge · Profile · Original Entry (gõ, nói, tô màu theo kết quả) |
| Screen states | Empty · No results · Loading / skeleton · Error / retry · Success · Keyboard open |

Các luồng nối với nhau thật: xóa → hộp xác nhận → toast **Undo**; sửa rồi đóng → “Discard changes?”; bật nhắc nhở khi chưa có quyền → permission prompt; ghi âm → xử lý → văn bản vào ô Write; chọn ngày/giờ trong form mở picker tương ứng; bộ lọc đếm lại số kết quả.

## Hoạ tiết trong UI Kit

| Ở đâu | Hoạ tiết (từ `reference/src/decor`) |
| --- | --- |
| Màn All entries / Weekly goals / Event reminders (và các trạng thái empty, lỗi, bàn phím) | tranh đầu trang, lá hai góc trên, dây hoa cuối trang tựa lên thanh tab, cảnh mèo trên bậu cửa cuối trang Event |
| Thẻ trong danh sách | `CardSprigs` bọc thẻ: cặp cành lá đè mép trái/phải, thẻ thứ i dùng cặp i % 4 (nhịp của Weekly goals) |
| Bên trong thẻ | Event card: cặp lá i % 3 · Review entry card: cặp lá i % 4 · Metric card: cành ở góc dưới phải i % 4 · Report card: tranh hoa bên phải · thẻ xanh "hôm nay": lá sáng |
| Nút xanh cỡ md | hai cụm lá sáng trong nút (như "Save all 4"); tắt bằng `leaves={false}` |
| Bong bóng câu nói, nhãn "AI found" | lá trong bong bóng và trong nhãn |
| Huy hiệu, cây | hình huy hiệu và cây "mature" của màn Garden |
| Empty state | cảnh mèo của Review entry, AI Coach, Event reminders |

Không đặt hoạ tiết vào: ô nhập, chip, công tắc, nút nhỏ, dialog, toast, picker.

## Cấu trúc

| Đường dẫn | Nội dung | Khi sang RN |
| --- | --- | --- |
| `reference/` → `../rn-decor` | symlink tới gói mockup gốc (asset @1x/@2x/@3x, `src/decor`, `src/components`, 10 màn ví dụ) — nguồn hoạ tiết duy nhất | chép nguyên `rn-decor` |
| `src/ui/Decor.tsx`, `src/ui/EdgeDecor.tsx` | `<Decor>` và `CardSprigs` viết trên primitives | dùng `reference/src/decor/Decor.tsx` |
| `src/primitives/index.tsx` | Shim web cho `View`, `Text`, `Pressable`, `TextInput`, `ScrollView`, `Modal`, `Image`, `ActivityIndicator`, `StyleSheet`, SVG, cùng các hook môi trường | **thay cả file** bằng re-export (bảng dưới) |
| `src/theme/` | token màu, bán kính, bóng, màu theo loại ghi chép, `AccentProvider` | chép nguyên, sửa `font()` |
| `src/icons/` | `Icon` theo tên (lưới 24, nét 2) và icon màn Today | chép nguyên (bỏ `StatusGlyphs`) |
| `src/data/` | kiểu dữ liệu, dữ liệu mẫu, định dạng ngày/tiền, **âm lịch** | chép nguyên |
| `src/ui/` | kit: Button, Field, Controls, Navigation, Pickers, Sheet, Feedback, States | chép nguyên |
| `src/ui/CardShell.tsx` | vỏ card dùng chung: `CardShell` (mặc định / đang nhấn / sắc thái), `CardHeader`, `DataState` (đang tải / chưa có dữ liệu / lỗi tải), `EstimateTag` | chép nguyên |
| `src/ui/Cards.tsx`, `SummaryCards.tsx`, `AiCards.tsx`, `PersonalCards.tsx` | 16 loại card | chép nguyên |
| `src/sheets/` | các bottom sheet và picker hoàn chỉnh | chép nguyên |
| `src/components/`, `src/screens/` | màn Today | chép nguyên |
| `src/gallery/` | màn ngữ cảnh (Entries, Goals, Events), board component, danh mục biến thể | `screens.tsx` dùng làm tham khảo bố cục; còn lại chỉ để xem |
| `src/App.tsx`, `src/index.css` | khung gallery, bàn phím giả, status bar giả | **không** mang sang |

Quy ước: layout flexbox cột mặc định như RN, style là object trong `StyleSheet.create`, đơn vị dp, không dùng class/selector trong component, tương tác qua `Pressable` (`onPress`, style dạng hàm `({ pressed })`), trợ năng qua `accessibilityRole/State/Label/Value`.

## Quy ước cho card

- Card bấm được nhận `onPress`; khi đó `CardShell` là một `Pressable` và tự vẽ trạng thái nhấn. Prop `pressedPreview` chỉ dùng để vẽ trạng thái nhấn trên board tĩnh.
- Card lấy dữ liệu nhận `status: 'ready' | 'loading' | 'empty' | 'error'`. Khi chưa `ready`, card giữ nguyên tiêu đề và thay phần thân bằng `DataState`, nên bố cục không nhảy khi dữ liệu về.
- Giá trị do AI ước tính luôn có tiền tố `≈` và nhãn viền nét đứt **Estimated**; giá trị cần kiểm tra có nền vàng viền nét đứt và câu hỏi cụ thể.
- Card không tự giãn chiều ngang theo `flex`. Hai card chung một hàng thì truyền `style={half}` (xuất từ `Cards.tsx`).

## Chuyển sang React Native 0.83

### 1. Primitives

| Shim | Thay bằng |
| --- | --- |
| `View`, `Text`, `Pressable`, `TextInput`, `Image`, `ScrollView`, `Modal`, `ActivityIndicator`, `StyleSheet`, `useWindowDimensions` | `react-native` |
| `Svg`, `Path`, `Rect`, `Ellipse`, `Circle`, `G` | `react-native-svg` |
| `useSafeAreaInsets` | `react-native-safe-area-context` |
| `EnteringView entering="SlideInDown"` | `<Animated.View entering={SlideInDown.duration(260)}>` của `react-native-reanimated` (tương tự `FadeIn`, `ZoomIn`) |
| `PulseView` | `Animated.View` + `withRepeat(withTiming(...))` |
| `useKeyboardHeight` | `useReanimatedKeyboardAnimation` / `useKeyboardState` của `react-native-keyboard-controller`, hoặc `Keyboard.addListener` |
| `KeyboardSimProvider` | bỏ (chỉ dùng cho bàn phím giả trên web) |

Lưu ý:

- **Modal:** trên web `Modal` được portal vào khung máy; trên RN là `Modal transparent` thật. Muốn kéo để đóng thì thay phần vỏ trong `src/ui/Sheet.tsx` bằng `@gorhom/bottom-sheet` (`BottomSheetModal` + `BottomSheetScrollView` + `BottomSheetFooter`), giữ nguyên nội dung.
- **Sheet chồng nhau:** khi một sheet mở picker con, sheet cha được ẩn (`visible && !picker`) thay vì chồng hai `Modal`, vì iOS xử lý Modal lồng nhau kém.
- **Toast:** `ToastProvider` đặt ở gốc app, bên trong `SafeAreaProvider`. Trên RN, toast nằm dưới `Modal` đang mở; các luồng trong mockup đều đóng sheet trước khi hiện toast.

### Asset

`require('…png')` trong `reference/src/decor` chạy thẳng với Metro (tự chọn @2x/@3x). Trên web, plugin `rn-require-png` trong `vite.config.ts` đổi chúng thành URL của bản @2x.
Bản @3x là phóng to (mockup rộng 851 px), xem "Lưu ý chất lượng" trong `reference/README.md`.

### 2. Font Nunito

Thêm `Nunito-Regular/Medium/SemiBold/Bold/ExtraBold/Black.ttf` (`npx react-native-asset`). Android không chọn weight của font tuỳ biến qua `fontWeight`, nên đổi `font()` trong `src/theme/tokens.ts` để trả `fontFamily` theo từng file.

### 3. Bàn phím

`Sheet` tự nâng lên đúng bằng chiều cao bàn phím (`useKeyboardHeight`) và giữ footer (nút Lưu) ngay trên bàn phím, phần thân cuộn được. Các màn có ô tìm kiếm ẩn tab bar khi bàn phím mở. Xem 3 biến thể ở **Screen states → Keyboard open**.

### 4. Shadow, gradient, `%`

`boxShadow` (kể cả `inset`, nhiều lớp), `experimental_backgroundImage` và `gap` chạy trên New Architecture (kiến trúc duy nhất của 0.83). Lưới 2 cột dùng `flexBasis: '40%'` + `flexGrow: 1`.

### 5. Quyền

`PermissionPrompt` là màn giải thích **trước** hộp thoại hệ thống: “Allow” gọi `request()` của `react-native-permissions`, “Open Settings” gọi `Linking.openSettings()`.

### 6. `<Text>` lồng nhau

Shim `Text` hiển thị `<Text>` con dạng inline như RN, nên đoạn tô màu trong Original Entry Card dùng nguyên được trên RN.

### 7. Âm lịch

`src/data/lunar.ts` là hàm thuần (thuật toán Hồ Ngọc Đức, múi giờ +7), đã đối chiếu: Tết 2025 (29/1), Tết 2026 (17/2), Trung thu 2026 (25/9), tháng 6 nhuận 2025. Kèm `canChi()` (2026 → Bính Ngọ).

## Ghi chú

- Ngôn ngữ giao diện là tiếng Anh, theo màn Today đã thống nhất. Chuỗi đang viết trực tiếp trong component; nếu cần đa ngôn ngữ thì gom ra một file i18n.
- Ánh xạ tab trong mockup: Entries thuộc **Today**, Goals thuộc **Garden**, Events thuộc **Menu**. Đây là giả định, chưa được chốt.
- Ảnh nền màn Today: `src/assets/today-bg@2x.webp` (780 × 1688). Nên xuất thêm @3x.

## Ghi chú về symlink

`ui-kit/reference` là symlink, nên không phải chép thêm 23 MB ảnh. Vite build với `resolve.preserveSymlinks: true` để mã trong `rn-decor` tìm thư viện trong `ui-kit/node_modules`.
Trên Windows, cần bật `git config core.symlinks true` (và Developer Mode) trước khi clone; nếu không, thay `ui-kit/reference` bằng bản chép của `rn-decor`.
