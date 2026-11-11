# 10 màn: Today, How was your day?, AI Coach, Weekly goals, Event reminders, Review entry, Reports, Menu, All entries, Garden — React Native 0.82

Gói này thay cho các gói trước (`rn-decor-today`, `rn-decor-v2` … `rn-decor-v10`). Các màn dùng chung `Decor` và bộ icon;
Today và How was your day? dùng chung thanh tab.

## Có gì trong gói

```
assets/decor/today/      8 ảnh PNG nền trong suốt (@1x, @2x, @3x) cho màn Today
  todayHero          390×164 pt  lá treo + cửa sổ + mèo ngủ + dây leo (nằm dưới thanh trạng thái)
  leafEnergyLeft      19×58 pt   cành lá cạnh góc trên-trái thẻ Energy
  leafEnergyRight     42×115 pt  lá + hoa đè lên mép phải thẻ Energy
  flowerMoneyRight    62×76 pt   hoa + chuông xanh đè lên góc dưới-phải thẻ Money
  leafMoneyLeft       35×44 pt   lá giữa thẻ Money và Weekly goals, mép trái
  leafGoalsRight      31×30 pt   lá ở góc dưới-phải thẻ Weekly goals (nấp sau nút "See all")
  garlandBottomLeft   75×163 pt  dây hoa góc dưới-trái, tựa lên thanh tab
  garlandBottomRight  97×96 pt   dây hoa góc dưới-phải, tựa lên thanh tab
assets/decor/logDay/     4 ảnh của màn "How was your day?" (như gói trước)
assets/decor/coach/      10 ảnh của màn "AI Coach"
  leavesTopLeft       126×64 pt  lá góc trên-trái (một phần nấp sau nút quay lại)
  flowersTopRight     171×125 pt lá + hoa góc trên-phải
  leavesReportLeft     18×119 pt cành lá mép trái, nằm sau thẻ báo cáo tuần
  leavesSleepRight     49×61 pt  lá đè lên mép phải thẻ "Lack of sleep"
  flowersEatingRight   74×76 pt  hoa đè lên góc dưới-phải thẻ "Eating out more"
  flowersCorrRight     66×71 pt  hoa đè lên góc dưới-phải thẻ "Correlation found"
  garlandBottomLeft   159×232 pt dây hoa góc dưới-trái màn hình
  flowersBottomRight   75×68 pt  hoa góc dưới-phải màn hình
  reportArt           220×154 pt cửa sổ, cây và mèo ngủ BÊN TRONG thẻ báo cáo tuần (không có chữ)
  reportLeaf           30×27 pt  chiếc lá ở góc dưới-trái bên trong thẻ báo cáo
assets/decor/goals/      17 ảnh của màn "Weekly goals"
  leavesTopLeft       125×66 pt  lá góc trên-trái
  catTopRight         197×218 pt cửa sổ, mèo ngủ trên bậu, hoa; lá chạy xuống mép phải
  leavesHeaderLeft     25×75 pt  cành lá mép trái giữa nút quay lại và thẻ tuần
  sprigWeekLeft/Right  47×33, 47×42 pt  hai cành lá BÊN TRONG thẻ chọn tuần
  sprigGoal1…4Left/Right            cành lá đè lên mép trái/phải từng thẻ mục tiêu (8 ảnh)
  garlandBottomLeft   120×148 pt dây hoa góc dưới-trái
  garlandBottomRight  109×99 pt  hoa góc dưới-phải
  btnLeavesLeft/Right  44×33, 32×34 pt  lá sáng vẽ BÊN TRONG nút xanh "Add a goal"
assets/decor/events/     15 ảnh của màn "Event reminders"
  leavesTopLeft       126×66 pt  lá góc trên-trái
  flowersTopRight     152×171 pt lá + hoa góc trên-phải, rủ xuống cạnh thẻ "hôm nay"
  leavesTodayLeft/Right            cành lá ngay ngoài mép trái/phải thẻ "hôm nay"
  todayLeavesLeft/Right            lá sáng BÊN TRONG thẻ xanh "hôm nay"
  sprigEvent1…3Left/Right          cành lá BÊN TRONG mỗi thẻ sự kiện (bên trái đè lên góc ô ngày)
  addLeavesLeft/Right              lá sáng BÊN TRONG nút "Add event"
  bottomScene         390×244 pt cửa sổ, hoa, quyển sách, mèo ngủ trên bậu — cuối trang, co theo bề ngang
assets/decor/review/     20 ảnh của màn "Review entry"
  leavesTopLeft / flowersTopRight   lá góc trên-trái (chạy xuống mép trái) / lá + hoa góc trên-phải
  leavesQuoteRight, leavesCard1Left, leavesCard3Left   cành lá mép màn, nằm sau bong bóng / thẻ
  sprigEntry1…4Left/Right           cành lá nhỏ BÊN TRONG các thẻ mục (góc dưới)
  catScene            280×217 pt cửa sổ, cây, hoa và mèo ngủ phía trên nút Save (góc phải)
  leavesActionsLeft, leavesNavLeft/Right   lá cạnh nút Discard và tựa lên thanh tab
  quoteLeaves, pillLeaf, saveLeavesLeft/Right   lá BÊN TRONG bong bóng câu nói, nhãn "AI found", nút Save
assets/decor/reports/    14 ảnh của màn "Reports"
  heroTop             390×163 pt lá góc trái, cửa sổ, mèo ngủ, hoa góc phải — rộng bằng màn, co theo bề ngang
  leavesWeekLeft/Right             cành lá cạnh / đè mép phải thẻ chọn tuần
  sprigStat1…4                     cành lá đè góc dưới-phải 4 thẻ số liệu
  flowersPattern      69×58 pt   hoa đè góc dưới-phải thẻ "A pattern to explore"
  reviewArt, reviewArtLeft         tranh BÊN TRONG thẻ "Your weekly review" (phải) và hoa góc dưới-trái trong thẻ
  leavesReviewLeft, reviewLeavesRight   lá ngoài mép trái / phải thẻ review
  garlandNavLeft/Right             hoa tựa lên thanh tab
assets/decor/menu/       9 ảnh của màn "Menu"
  heroTop             390×175 pt lá góc trái, cửa sổ, mèo ngủ, hoa góc phải — rộng bằng màn, co theo bề ngang
  flowersProfileLeft   38×55 pt  hoa mép trái, ngay dưới thẻ "Your profile"
  flowersJournalTopRight / Left / Right   hoa đè góc trên-phải, dưới-trái, dưới-phải thẻ "Your journal"
  flowersPrefsLeft     38×56 pt  hoa đè góc dưới-trái thẻ "Preferences"
  flowersMoreTopRight  46×59 pt  hoa mép phải giữa "Preferences" và "More"
  garlandNavLeft/Right 77×63, 84×75 pt  hoa tựa lên thanh tab
assets/decor/entries/    5 ảnh của màn "All entries"
  heroTop             390×202 pt lá góc trái (một phần nấp sau nút quay lại), cửa sổ, mèo ngủ, hoa chạy xuống mép phải
  flowersChipsLeft     32×62 pt  hoa mép trái, nấp sau nút "All"
  flowersFiltersRight  51×60 pt  hoa đè góc dưới-phải nút Filters
  garlandEndLeft/Right 75×78, 85×135 pt  hoa ở cuối danh sách, đè mép các thẻ cuối, tựa lên thanh tab
assets/decor/garden/     15 ảnh của màn "Garden"
  heroTop             390×319 pt lá, bầu trời và bức tranh khu vườn KHÔNG có cây (tường, hàng rào, cỏ, mèo ngủ)
  treeMature          211×190 pt cây giai đoạn "mature" — lớp riêng, nền trong suốt, kèm bóng dưới gốc
  sprigStat1…3                   cành lá BÊN TRONG 3 thẻ số liệu (góc dưới-phải, nằm dưới chữ)
  leavesLeftMid/RightMid         lá mép trái / phải cạnh hàng thẻ số liệu
  badge7Day, badge30Day          hình huy hiệu đã đạt (kèm vòng tròn nền)
  badge100DayLocked, badgeDisciplineLocked, badgeGreenLifeLocked   hình huy hiệu chưa đạt (nhạt màu)
  wiltFlower           22×25 pt  bông hồng héo sau câu "Miss 3 days…"
  garlandEndLeft/Right 164×65, 132×137 pt  hoa cuối trang, tựa lên thanh tab
src/decor/Decor.tsx              <Decor asset=…>, useArtScale(), DESIGN_WIDTH
src/decor/todayDecor.tsx         ảnh, vị trí neo, <TodayHero>, <BottomGarlands> của màn Today
src/decor/logDayDecor.tsx        ảnh, vị trí neo, <LogDayHero>, <LogDayScreenDecor> của màn How was your day?
src/decor/coachDecor.tsx         ảnh, vị trí neo, <CoachHeaderDecor>, <CoachBottomDecor>, <ReportCardArt> của màn AI Coach
src/decor/goalsDecor.tsx         ảnh, vị trí neo, GOAL_SPRIGS, <GoalsHeaderDecor>, <GoalsBottomDecor> của màn Weekly goals
src/decor/eventsDecor.tsx        ảnh, vị trí neo, EVENT_SPRIGS, <EventsHeaderDecor>, <EventsBottomScene>, useSceneSpace()
src/decor/reviewDecor.tsx        ảnh, vị trí neo, ENTRY_SPRIGS, <ReviewHeaderDecor>, <ReviewBottomDecor>
src/decor/reportsDecor.tsx       ảnh, vị trí neo, STAT_SPRIGS, <ReportsHero>, <ReportsNavGarlands>
src/decor/menuDecor.tsx          ảnh, vị trí neo, <MenuHero>, <MenuNavGarlands>
src/decor/entriesDecor.tsx       ảnh, vị trí neo, <EntriesHero>, <EntriesEndGarlands>
src/decor/gardenDecor.tsx        ảnh, GARDEN_CARD, GARDEN_TREES, GARDEN_GROUND, useGardenGeometry(), STAT_SPRIGS,
                                 <GardenHero>, <GardenTree>, <GardenEndGarlands>
src/components/BottomNav.tsx     thanh tab dùng chung (Today, Garden, +, Insights/Lessons, Menu)
src/components/icons.tsx         icon vẽ bằng react-native-svg
src/screens/TodayScreen.example.tsx   màn Today, nhận dữ liệu qua prop `data` (SAMPLE_TODAY giống mockup)
src/screens/LogDayScreen.example.tsx  màn How was your day? (đổi tên từ TodayScreen.example.tsx của gói rn-decor-today)
src/screens/CoachScreen.example.tsx   màn AI Coach, nhận dữ liệu qua prop `data` (SAMPLE_COACH giống mockup), `onBack`
src/screens/GoalsScreen.example.tsx   màn Weekly goals: prop `data` (SAMPLE_GOALS giống mockup), `onBack`, `onPrevWeek`,
                                      `onNextWeek`, `onGoalMenu(id)`, `onAddGoal`
src/screens/EventsScreen.example.tsx  màn Event reminders: props `today`, `events` (mẫu giống mockup), `onBack`,
                                      `onEventPress(id)`, `onBellPress(id)`, `onAddEvent`
src/screens/ReviewScreen.example.tsx  màn Review entry: prop `data` (câu nói, số giây, danh sách mục — SAMPLE_REVIEW giống
                                      mockup), `onBack`, `onEdit(id)`, `onDiscard`, `onSaveAll`
src/screens/ReportsScreen.example.tsx màn Reports (tab Insights): prop `data` (SAMPLE_REPORTS), `period` / `onPeriodChange`,
                                      `onPrev`, `onNext`, `onOpenReview`
src/screens/MenuScreen.example.tsx    màn Menu (tab Menu): `sections` (MENU_SECTIONS — thêm/bớt/đổi thứ tự dòng tuỳ ý),
                                      `profileSub`, `onOpenProfile`, `onOpen(key)`
src/screens/EntriesScreen.example.tsx màn All entries: `groups` (mục theo ngày — SAMPLE_GROUPS giống mockup),
                                      `query`/`onQueryChange`, `chip`/`onChipChange`, `dateLabel`, `onBack`,
                                      `onDatePress`, `onFiltersPress`, `onEntryPress(id)`
src/screens/GardenScreen.example.tsx  màn Garden (tab Garden): prop `data` (hình cây `tree`, giai đoạn, điểm, chuỗi
                                      ngày, danh sách huy hiệu — SAMPLE_GARDEN giống mockup), `onBadgePress(key)`
```

Cần thêm: `react-native-svg`, `react-native-safe-area-context`, font Nunito bản đầy đủ (có dấu tiếng Việt, tải từ
Google Fonts) đăng ký theo tên `Nunito-Regular`, `Nunito-Medium`, `Nunito-SemiBold`, `Nunito-Bold`, `Nunito-ExtraBold`,
`Nunito-Black`. Tranh đầu màn nằm dưới thanh trạng thái: Android cần bật edge-to-edge (hoặc `StatusBar translucent`).

## Đổi so với gói trước

- `TodayScreen.example.tsx` cũ (màn "How was your day?") đổi tên thành `LogDayScreen.example.tsx`, vì "Today" giờ là màn tổng quan.
- `Decor` nhận `asset={…}` thay cho `name="…"`; ảnh của từng màn nằm trong `todayDecor.tsx` / `logDayDecor.tsx`.
- Thanh tab tách thành `BottomNav` dùng chung, kích thước theo mockup mới nhất.
  Mockup đầu ghi tab thứ tư là **Lessons**, mockup này là **Insights**; `BottomNav` nhận `tabs` để chọn.

## Đổi so với gói rn-decor-v10

- Màn Garden: **cây tách thành lớp riêng** (`treeMature`) để mỗi giai đoạn dùng một hình cây khác. `heroTop` giờ là khu
  vườn không có cây; phần nền sau cây được vẽ bù bằng AI (LaMa) để khi cây nhỏ hơn vẫn thấy tường, trời, cỏ liền mạch.
- Bỏ `crownFront`: lớp cây vẽ sau khung thẻ nên ngọn cây tự đè lên viền thẻ.
- Nhãn "DAY 31 · MATURE" và "Healthy" vẽ sau cây, để cây to đến đâu cũng không che nhãn.
- Xem `docs/preview-garden-tree-layer.png`: nền không cây, lớp cây, và ví dụ cây thu nhỏ đặt vào cùng chỗ.

## Thêm hình cây cho các giai đoạn khác

1. Designer vẽ từng giai đoạn trên **cùng nền** với mockup (`heroTop`), cùng tỉ lệ khung 390 pt, rồi xuất riêng cây:
   PNG nền trong suốt, 3 cỡ `@1x/@2x/@3x`, **kèm bóng dưới gốc** (bóng là một phần của lớp cây, nền không có bóng).
2. Ghi lại điểm gốc cây `base`: chỗ thân cây chạm đất, tính bằng pt từ góc trên-trái ảnh @1x.
3. Thêm vào `GARDEN_TREES` trong `gardenDecor.tsx`, ví dụ:
   `sprout: { source: require('…/treeSprout.png'), width: 40, height: 46, base: { x: 20, y: 42 } }`.
4. Truyền vào màn: `data.tree = GARDEN_TREES[stage]`. `<GardenTree>` đặt `base` của ảnh lên `GARDEN_GROUND`
   (202,1 ; 279,6 pt trong `heroTop`) và co theo bề ngang màn như phần nền.
5. Giới hạn: cây bị cắt ở mép trên phần thông tin (279,6 pt là mặt đất, phần thông tin bắt đầu ở 298,8 pt) và ở hai mép
   màn. Để không đè tiêu đề "Garden", ngọn cây không nên cao hơn khoảng 180 pt tính từ gốc (cây mature cao 180 pt); chiều
   ngang nên trong khoảng 185 pt bên trái gốc và 170 pt bên phải gốc (mép trong của thẻ).

## Đổi so với gói rn-decor-v9

- Thêm màn Garden: `gardenDecor.tsx`, `GardenScreen.example.tsx`, 15 ảnh trong `assets/decor/garden/`.
- `icons.tsx` thêm `GardenFlowerIcon`, `DropIcon`, `LockIcon`.
- `BottomNav`: khi tab Garden đang chọn, icon đổi thành bông hoa xanh như mockup (các màn khác không đổi).

## Cách neo hoạ tiết ở màn Garden

1. **Khu vườn (không có cây) là một phần của tranh đầu trang** (`heroTop`, co theo bề ngang). Khung thẻ cây (viền,
   phần thông tin bên dưới) là code, đặt lên tranh bằng `useGardenGeometry()`: vị trí và bề rộng thẻ nhân cùng tỉ lệ
   với tranh nên khung luôn khớp tranh ở mọi cỡ màn.
2. **Cây** là lớp riêng (`<GardenTree tree={data.tree}>`), vẽ SAU khung thẻ (ngọn cây đè lên viền trên như mockup) và
   TRƯỚC hai nhãn "DAY 31 · MATURE", "Healthy".
3. **Cành lá trong thẻ số liệu** vẽ TRƯỚC chữ (chữ nằm trên lá như mockup). Lá ở hai mép màn vẽ SAU hàng thẻ.
4. **Huy hiệu là dữ liệu** (`badges`): mỗi huy hiệu có `earned` và hình `art`. Chưa đạt thì thẻ nhạt và có ổ khoá vẽ
   bằng code.
5. **Hoa cuối trang** nằm trong nội dung cuộn (như màn All entries): trang ngắn thì hoa tựa lên thanh tab.
6. Thanh tiến độ dùng `stageProgress` (0–1, tiến độ trong giai đoạn hiện tại). Mockup để trống thanh (Mature bắt đầu ở
   45 điểm, Blooming ở 90 điểm), nên dữ liệu mẫu là 0.

## Đổi so với gói rn-decor-v8

- Thêm màn All entries: `entriesDecor.tsx`, `EntriesScreen.example.tsx`, 5 ảnh trong `assets/decor/entries/`.
- `icons.tsx` thêm `SearchIcon`, `CalendarPencilIcon`, `SlidersIcon`, `DumbbellFlatIcon`, `CoinIcon`. Các màn khác giữ nguyên.

## Cách neo hoạ tiết ở màn All entries

1. **Cả trang cuộn**, thanh tab đứng yên (tab Menu sáng vì màn này mở từ Menu). Tranh đầu trang rộng bằng màn hình,
   co theo bề ngang, cuộn cùng tiêu đề.
2. **Hoa cạnh nút "All"** vẽ TRƯỚC hàng nút lọc (nút "All" che một phần). **Hoa ở góc nút Filters** vẽ SAU, và khối
   chứa nó có `zIndex: 2` để hoa nằm đè lên góc thẻ đầu tiên như mockup.
3. **Hoa cuối danh sách** nằm trong nội dung cuộn (`flexGrow: 1`), neo vào đáy nội dung: danh sách dài thì hoa xuất
   hiện khi cuộn tới cuối, đè mép các thẻ cuối; danh sách ngắn thì hoa tựa lên thanh tab.
4. **Danh sách là dữ liệu**: mỗi nhóm có tiêu đề ngày và các mục; màu ô icon và màu số bên phải theo loại mục
   (thu/ăn: xanh lá, chi: nâu đỏ, tập/ngủ: xanh dương).
5. Màn hẹp: 5 nút lọc chia bề ngang theo tỉ lệ mockup, chữ trong nút và số bên phải tự nhỏ lại một chút.

## Đổi so với gói rn-decor-v7

- Thêm màn Menu: `menuDecor.tsx`, `MenuScreen.example.tsx`, 9 ảnh trong `assets/decor/menu/`.
- `icons.tsx` thêm `PersonIcon`, `FlagWavyIcon`, `CalendarBellIcon`, `GlobeIcon`, `SunriseIcon`, `ShieldLeafIcon`,
  `HelpBubbleIcon`, `BookWideIcon`. Các màn khác giữ nguyên.

## Cách neo hoạ tiết ở màn Menu

1. **Cả trang cuộn**, thanh tab đứng yên (tab Menu sáng). Tranh đầu trang rộng bằng màn hình, co theo bề ngang, cuộn
   cùng tiêu đề; máy có thanh trạng thái thấp thì tranh trượt lên cùng tiêu đề.
2. **Hoa ở góc thẻ** vẽ SAU thẻ, trong khối rộng bằng màn hình bọc thẻ đó, neo vào mép trên hoặc mép dưới của thẻ
   (`MENU_ANCHORS`). Thêm hay bớt dòng trong một nhóm thì thẻ cao/thấp đi, hoa vẫn bám đúng góc.
3. **Danh sách là dữ liệu**: mỗi nhóm có `title` và `items` (nhãn, màu ô icon, icon, giá trị phụ như "English").
   Hoa gắn theo `key` của nhóm (`journal`, `prefs`, `more`).
4. **Hoa hai góc dưới** tựa lên thanh tab, đứng yên và nằm DƯỚI danh sách.

## Đổi so với gói rn-decor-v6

- Thêm màn Reports: `reportsDecor.tsx`, `ReportsScreen.example.tsx`, 14 ảnh trong `assets/decor/reports/`.
- `icons.tsx` thêm `MoonClockIcon`, `BookOpenIcon`, `TrendUpIcon`. Các màn khác giữ nguyên.

## Cách neo hoạ tiết ở màn Reports

1. **Cả trang cuộn**, thanh tab đứng yên (tab Insights sáng). Tranh đầu trang rộng bằng màn hình, co theo bề ngang,
   cuộn cùng tiêu đề; máy có thanh trạng thái thấp thì tranh trượt lên cùng tiêu đề.
2. **Cành lá đè mép thẻ** (thẻ chọn tuần, 4 thẻ số liệu, thẻ pattern) vẽ SAU thẻ, neo góc của thẻ. Thẻ số liệu thứ i
   dùng cành i % 4.
3. **Tranh trong thẻ "Your weekly review"** nằm trong thẻ (`overflow: 'hidden'`), neo góc trên-phải; nút "Read weekly
   report" vẽ đè lên phần dưới của tranh như mockup.
4. **Hoa hai góc dưới** tựa lên thanh tab, đứng yên và nằm DƯỚI danh sách (giống màn Today).
5. Màn hẹp: số to trong thẻ số liệu tự nhỏ lại theo bề ngang cột ("612,000đ" không bị cắt); chữ phụ xuống 2 dòng; câu
   trong thẻ pattern xuống dòng trước cụm hoa.

## Đổi so với gói rn-decor-v5

- Thêm màn Review entry: `reviewDecor.tsx`, `ReviewScreen.example.tsx`, 20 ảnh trong `assets/decor/review/`.
- `icons.tsx` thêm `ForkKnifeIcon`, `WalletIcon`, `DumbbellIcon`, `PencilIcon`, `CheckIcon` (đồng xu "$" vẽ bằng View + Text).
- `BottomNav`: `active={null}` để không tab nào sáng (màn mở từ nút +); icon Today đổi sang màu nâu khi không chọn,
  đúng như mockup. Màn Today giữ nguyên.

## Cách neo hoạ tiết ở màn Review entry

1. **Danh sách cuộn, hai nút Discard / Save đứng yên ngay trên thanh tab**, nên nút lưu luôn bấm được; danh sách dừng ở
   mép trên hai nút.
2. **Tranh mèo, lá cạnh nút và lá trên thanh tab** đứng yên, nằm DƯỚI danh sách (như dây hoa màn Today): thẻ cuộn qua che
   chúng. Ở 390pt danh sách ngắn nên tranh hiện đủ như mockup; máy thấp (iPhone SE) phải cuộn mới thấy hết thẻ cuối.
3. **Lá bên trong bong bóng câu nói, nhãn "AI found", các thẻ mục và nút Save** nằm trong chính thành phần đó, neo góc dưới.
   Mục thứ i dùng cặp cành i % 4.
4. Kiểu từng loại mục (màu ô icon, màu viền, nhãn MEALS / EXPENSES / INCOME / EXERCISE, số tiền đỏ / xanh) nằm trong
   bảng `KINDS`; dữ liệu chỉ cần `kind`, `title`, `detail`.

## Đổi so với gói rn-decor-v4

- Thêm màn Event reminders: `eventsDecor.tsx`, `EventsScreen.example.tsx`, 15 ảnh trong `assets/decor/events/`.
- `icons.tsx` thêm `BellFilledIcon` (chuông đặc) và `ArrowRightIcon` (thay ký tự "→" mà Nunito không có).
  Các màn khác giữ nguyên.

## Cách neo hoạ tiết ở màn Event reminders

1. **Cả trang cuộn** như Weekly goals; dải giấy hiện dần sau thanh trạng thái khi bắt đầu cuộn.
2. **Tranh mèo cuối trang** (`bottomScene`) rộng bằng màn hình và co theo bề ngang. Nó là con đầu của nội dung cuộn
   (nằm dưới mọi thứ), neo đáy; nội dung chừa `useSceneSpace()` bên dưới nút "Add event" để nút nằm đúng chỗ trên tranh.
   Máy cao: tranh ở đáy màn hình; máy thấp: tranh hiện ra khi cuộn tới cuối.
3. **Lá trong thẻ xanh "hôm nay", trong mỗi thẻ sự kiện và trong nút "Add event"** nằm BÊN TRONG thành phần đó, neo theo
   góc dưới. Cành bên trái của thẻ sự kiện vẽ SAU ô ngày nên đè lên góc ô như mockup. Sự kiện thứ i dùng cặp cành i % 3.
4. Màu ô ngày (`tone`: amber / green / blue), nhãn LUNAR / SOLAR và chữ "(leap)" lấy từ dữ liệu; `soon: true` tô hổ phách
   ngày sắp tới và cái chuông.
5. Màn hẹp: phần "→ Aug 16 · 296 days left" xuống dòng riêng thay vì bị cắt; thẻ cao thêm, cành lá vẫn neo đáy.

## Đổi so với gói rn-decor-v3

- Thêm màn Weekly goals: `goalsDecor.tsx`, `GoalsScreen.example.tsx`, 17 ảnh trong `assets/decor/goals/`.
- `icons.tsx` thêm `GoalCapIcon` (mũi tên chạm vạch: mục tiêu giới hạn). Các màn khác giữ nguyên.

## Cách neo hoạ tiết ở màn Weekly goals

1. **Cả trang cuộn**, kể cả tiêu đề lớn và tranh mèo (khác AI Coach có thanh tiêu đề cố định). Khi bắt đầu cuộn, một dải
   giấy mờ dần hiện lên sau thanh trạng thái để chữ không chạy dưới đồng hồ.
2. **Tranh mèo góc trên** vẽ TRƯỚC thẻ chọn tuần: thẻ che đường bóng dưới bậu cửa. Máy có thanh trạng thái thấp (iPhone SE)
   thì tranh trượt lên cùng tiêu đề.
3. **Cành lá hai bên mỗi thẻ mục tiêu** vẽ SAU thẻ đó (đè lên mép thẻ như mockup). Thẻ thứ i dùng cặp cành i % 4, nên danh
   sách dài hay ngắn hơn 4 mục vẫn giữ nhịp như mockup.
4. **Lá trong thẻ tuần và trong nút "Add a goal"** nằm bên trong chính thành phần đó, neo theo mép trong.
5. **Hai góc dưới** nằm ở cuối trang (màn này không có thanh tab): máy cao thì ở đáy màn hình, máy thấp thì hiện ra khi cuộn
   tới cuối. Nhờ vậy dòng chú thích "Progress comes from…" không bao giờ nằm đè lên lá.
6. Thanh tiến độ: chữ bên phải căn phải, rộng tối thiểu 58,5 pt; thanh co giãn phần còn lại, giống cách mockup để thanh
   ngắn lại khi chữ dài (500,000₫/700,000₫).

## Đổi so với gói rn-decor-v2

- Thêm màn AI Coach: `coachDecor.tsx`, `CoachScreen.example.tsx`, 10 ảnh trong `assets/decor/coach/`.
- `icons.tsx` thêm `ChevronLeft`, `SparkleIcon`, `WarningIcon`, `LinkIcon`, `BulbFilledIcon`, `CheckCircleIcon`.
  Các file khác của Today và How was your day? giữ nguyên.

## Cách neo hoạ tiết ở màn AI Coach

1. **Thanh tiêu đề cố định**, danh sách cuộn bên dưới. Hai cụm lá ở góc trên giữ nguyên cỡ và giữ khoảng cách tới đường kẻ
   dưới tiêu đề; máy có thanh trạng thái thấp (iPhone SE) thì cụm lá trượt lên, mép màn hình cắt bớt phần trên.
2. **Tranh trong thẻ báo cáo tuần** nằm trong thẻ (`overflow: 'hidden'`), neo góc dưới-phải, co theo chiều cao thật của
   thẻ (đo bằng `onLayout`) nên cửa sổ luôn chạy từ mép trên tới mép dưới thẻ. Chữ trong thẻ co theo bề ngang trên máy hẹp
   để không đè lên con mèo.
3. **Hoạ tiết đè lên thẻ** (lá, hoa bên phải ba thẻ) nằm trong khối của thẻ đó, vẽ sau thẻ (`COACH_ANCHORS`), sát mép màn hình.
4. **Hai góc dưới** đứng yên ở đáy màn hình và nằm DƯỚI danh sách, giống dây hoa màn Today: thẻ cuộn qua che chúng.
   (Mockup vẽ một bông hoa chạm góc dưới-trái thẻ "Advice"; ở đây bông hoa đó nằm sau thẻ.)
5. Màn này không có thanh tab; khoảng trống dưới thẻ "Advice" là 66 pt như mockup.

## Cách neo hoạ tiết ở màn Today

1. **Tranh đầu màn** co theo bề ngang màn hình. Huy hiệu "31", dòng ngày và mép trên thẻ nhắc nhở đặt theo phân số
   chiều cao tranh (`TODAY_SPOTS`), nên luôn đúng chỗ so với tranh; dòng ngày không bao giờ lọt vào dưới thanh trạng thái.
2. **Hoạ tiết hai bên thẻ** vẽ ĐÈ LÊN thẻ như mockup: mỗi cái nằm trong khối của thẻ cuối cùng mà nó chạm tới,
   vẽ sau thẻ đó (`TODAY_ANCHORS`). Thẻ giữ lề 17.2 / 16.3 pt nên hoạ tiết luôn sát mép màn hình. Hoạ tiết giữ nguyên cỡ pt.
3. **Lá dưới thẻ Weekly goals** nấp sau nút "See all" → vẽ trước hàng "Today's entries".
4. **Dây hoa hai góc dưới** tựa lên thanh tab, đứng yên khi danh sách cuộn và nằm DƯỚI danh sách: thẻ cuộn qua che
   chúng, nên hoa không bao giờ đè lên nội dung. Thanh tab vẽ sau cùng che mép cắt của chúng.
   (Mockup vẽ vài cánh hoa đè lên mép thẻ "Night sleep"; ở đây phần đó nằm sau thẻ.)
5. Chữ, số, thanh tiến độ, icon đều vẽ bằng code; không chữ nào nằm trong ảnh.

## Khác mockup có chủ ý

- **Chữ màu hổ phách** (dòng ngày giỗ, nhãn MONEY, chỉ số mục tiêu, thẻ LUNAR) đậm hơn mockup (`#946000` thay vì
  `#B87701`) để đạt độ tương phản 4,5:1; icon vẫn giữ màu sáng.
- **Số liệu và chữ to** dùng Nunito; mockup dùng kiểu chữ hẹp hơn nên số đo ở bề ngang lệch tối đa 3,5pt.
- **Mũi tên "→"** lấy từ font hệ thống vì Nunito không có ký tự này.
- **Tiêu đề mục tiêu dài** được xuống 2 dòng trên màn hẹp (360pt) thay vì bị cắt.

### Riêng màn AI Coach

- Chữ màu hổ phách (nhãn THINGS TO WATCH, ADVICE, tiêu đề hai thẻ) dùng `#946000` như màn Today; icon giữ màu sáng.
- Mockup dùng kiểu chữ khác Nunito: dòng tiêu đề lớn của thẻ báo cáo rộng/hẹp hơn mockup tối đa 4,5 pt mỗi dòng,
  phần chân chữ (g, p) ngắn hơn ~3 pt. Vị trí từng dòng, icon, thẻ lệch ≤ 1,5 pt.
- Dòng cuối của thẻ Advice thấp hơn hai dòng trên 2 pt như mockup (`adviceRowLast`); bỏ đi nếu muốn đều nhau.
- Chỗ giờ, pin, sóng và đảo đen trong mockup là nền giấy trơn trong ảnh, vì trên máy luôn có thanh trạng thái thật đè lên.

### Riêng màn Weekly goals

- Chữ trạng thái màu hổ phách (500,000₫/700,000₫, 805/1,800 kcal) dùng `#946000` thay `#A26701` để đủ 4,5:1; thanh và icon giữ màu sáng.
- Nút "Add a goal" là màu xanh phẳng + gờ đáy đậm; vân giấy màu nước trên mặt nút không giữ lại (chỉ giữ hai cụm lá).
- Thanh tiến độ vẽ đúng tỉ lệ `value/target`; mockup vẽ hơi lệch (3/5 trông như 63%).
- Ký tự "≥" lấy từ font hệ thống vì Nunito không có, nên dòng "Move ≥ 30 min…" hẹp hơn mockup 4,5 pt.
- Thẻ mục tiêu 3 và 4 trong mockup có tiêu đề cao hơn thẻ 1, 2 khoảng 2 pt; code dùng một khoảng cách chung.
- Chỗ giờ, pin, sóng, đảo đen và thanh home trong mockup là nền giấy trơn trong ảnh.
- Trên web có cảnh báo `useNativeDriver` (react-native-web không có module animation gốc); trên máy thật không có.

### Riêng màn Event reminders

- Chữ hổ phách ("Oct 26 · 2 days left", nhãn LUNAR) đậm hơn mockup để đủ 4,5:1; chuông và nền nhãn giữ màu sáng.
- Thẻ xanh và nút "Add event" là màu phẳng; vân màu nước trên mặt xanh không giữ lại (chỉ giữ các cụm lá).
- "15/9", "Wedding anniversary" và dòng "15/7 lunar (leap) → …" lệch bề ngang 3–4,5 pt so với mockup do khác font.
- Đổi ngày âm sang dương do backend làm; màn chỉ hiển thị kết quả (`day`, `month`, `dateLabel`, `daysLeft`).

### Riêng màn Review entry

- Tiêu đề trong mockup là "Review entry" (số ít); code giữ đúng chữ đó.
- Hoa của tranh mèo chạm mép phải thẻ EXERCISE trong mockup; ở đây chúng nằm sau thẻ.
- Nút Save màu xanh phẳng, không có viền sáng mảnh phía trên như mockup; lá vẫn giữ.
- Khoảng cách quanh dấu "·" hẹp hơn mockup một chút; nhãn EXERCISE hẹp hơn mockup 5 pt do khác font.

### Riêng màn Reports

- Chữ trong mockup hẹp hơn Nunito: "612,000đ" rộng hơn mockup 7 pt, "6h 10m" hẹp hơn 2 pt (dùng chung một cỡ chữ);
  tiêu đề "Reports" rộng hơn 4 pt.
- Nhãn "AI Coach · 2 min read" đậm hơn mockup (`#866548`) để đủ tương phản 4,5:1.
- Chỗ đảo đen và pin trong mockup nằm trên tranh cửa sổ; ở đó tranh được vẽ lại (hơi mờ), luôn bị thanh trạng thái che.
- Bông hoa ở góc dưới-phải thẻ review tựa lên thanh tab; phần nằm trong thẻ là một phần của tranh trong thẻ.

### Riêng màn Menu

- Chữ trong mockup không đều nhau: "Help & feedback" hẹp hơn Nunito 5,5 pt, "Event reminders" rộng hơn 3 pt; nhãn nhóm
  "PREFERENCES" hẹp hơn 5 pt nhưng "YOUR JOURNAL" khớp — giữ một kiểu chữ chung cho mọi dòng.
- Khoảng cách các dòng trong mockup không đều (49,5–51,3 pt); code dùng 50,6 pt cho mọi dòng.
- Chỗ đảo đen và pin trong mockup nằm trên tranh cửa sổ; ở đó tranh được vẽ lại (hơi mờ), luôn bị thanh trạng thái che.

### Riêng màn All entries

- Tiêu đề "All entries" dùng Nunito Black như các màn khác; chữ trong mockup thưa hơn một chút.
- Vùng sáng dưới bậu cửa sổ nhạt dần về phía tiêu đề (mockup có vầng sáng nằm sau chữ; tách chữ ra thì vầng sáng không
  còn đủ để giữ nguyên).
- Icon ví trong thẻ "Bonus" vẽ gọn hơn mockup (không có vạt thẻ phía sau).

### Riêng màn Garden

- Mockup chỉ có hình huy hiệu 100-day, Discipline master, Green life ở dạng chưa đạt (nhạt màu). Khi người dùng đạt
  các huy hiệu này cần hình màu đầy đủ từ designer, xuất theo cùng quy trình.
- Phía dưới bức tranh nằm sau phần thông tin (chỉ lộ ở hai góc bo) là cỏ được nối thêm, không phải tranh gốc.
- Phần nền sau cây (trời, cây xa, tường, cỏ quanh gốc) do AI vẽ bù, không có trong mockup; nhìn kỹ hơi mềm hơn phần
  tranh gốc. Nếu designer có bản nền gốc không cây thì thay `heroTop` bằng bản đó (xuất theo cùng quy trình).
- Trong mockup, thẻ huy hiệu Green life có hình cao hơn các thẻ hàng trên khoảng 3–4 pt; code dùng một bố cục chung nên
  thẻ này thấp hơn mockup một chút.
- Màn hẹp (360 pt): câu "Log at least once today…" xuống 2 dòng, thẻ cây cao thêm cho vừa.

## Lưu ý chất lượng

Các mockup Today, AI Coach, Weekly goals, Event reminders, Review entry, Reports, Menu, All entries, Garden rộng 851px (≈2,2 lần màn 390pt): bản @1x và @2x đủ nét, bản @3x là phóng to nên hơi mềm.
Chỗ có thanh trạng thái, đảo đen (Dynamic Island) và huy hiệu "31" trong mockup đã được vẽ lại bằng phần tranh xung quanh;
chỗ dưới huy hiệu chỉ là nền mờ vì luôn bị huy hiệu che. Có file gốc độ phân giải cao thì xuất lại theo cùng quy trình.

## Đã kiểm tra

Chạy cả mười màn bằng react-native-web ở 360×800, 375×667, 390×844, 430×932: không lỗi console.
Ở khung 390, vị trí từng chữ, icon, nút lệch mockup tối đa 3,5pt ở Today và How was your day?; ở AI Coach vị trí lệch
≤ 1,5pt, bề ngang một số dòng chữ lệch tới 4,5pt do khác font. Ở Weekly goals vị trí lệch ≤ 3pt, chỗ lệch 4,5pt là
bề ngang dòng có ký tự "≥". Ở Event reminders vị trí lệch ≤ 2 pt, bề ngang chữ lệch ≤ 4,5 pt. Ở Review entry vị trí lệch ≤ 2,5 pt, bề ngang chữ lệch ≤ 5 pt. Ở Reports vị trí lệch ≤ 2,5 pt, bề ngang chữ lệch ≤ 7 pt ("612,000đ"). Ở Menu vị trí lệch ≤ 2,5 pt, bề ngang chữ lệch ≤ 5,5 pt. Ở All entries vị trí lệch ≤ 2,5 pt, bề ngang chữ lệch ≤ 3 pt. Ở Garden vị trí lệch ≤ 2 pt (trừ thẻ Green life thấp hơn ~4 pt), bề ngang chữ lệch ≤ 5,5 pt.
Mã TypeScript qua `tsc --strict` với kiểu của React Native 0.82.1.
