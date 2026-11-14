import type { ReactNode } from 'react';
import { Icon } from '../icons/Icon';
import type { IconName } from '../icons/Icon';
import {
  EnteringView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useKeyboardHeight,
  useSafeAreaInsets,
  useWindowDimensions,
} from '../primitives';
import { colors, elevation, font, radii, ui } from '../theme/tokens';
import { IconButton } from './Button';

type SheetProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  /** Left of the title, e.g. a back button for a stacked step. */
  leading?: ReactNode;
  /** Replaces the close button. */
  trailing?: ReactNode;
  hideClose?: boolean;
  children?: ReactNode;
  /** Sticky actions; stays above the keyboard. */
  footer?: ReactNode;
  /** Fixed tall sheet instead of hugging content. */
  tall?: boolean;
  /** Tapping the scrim closes (default). Off for sheets with unsaved input. */
  dismissOnBackdrop?: boolean;
  scroll?: boolean;
  /** No title row: content leads (illustrated prompts). Title still names the dialog. */
  bare?: boolean;
  /** Stack footer buttons vertically. */
  footerStacked?: boolean;
};

/**
 * Bottom sheet shell. RN: the same tree inside <Modal transparent>, or swap the
 * shell for @gorhom/bottom-sheet (BottomSheetModal + BottomSheetScrollView +
 * BottomSheetFooter) to get drag-to-dismiss.
 */
export function Sheet({
  visible,
  onClose,
  title,
  subtitle,
  leading,
  trailing,
  hideClose,
  children,
  footer,
  tall,
  dismissOnBackdrop = true,
  scroll = true,
  bare,
  footerStacked,
}: SheetProps) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const keyboard = useKeyboardHeight();
  const maxHeight = height - insets.top - 10 - keyboard;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        accessibilityLabel="Close"
        onPress={dismissOnBackdrop ? onClose : undefined}
        style={[StyleSheet.absoluteFill, { backgroundColor: ui.scrim, cursor: 'default' }]}
      />
      <EnteringView entering="SlideInDown" style={[styles.anchor, { bottom: keyboard }]} pointerEvents="box-none">
        <View
          accessibilityViewIsModal
          accessibilityLabel={title}
          style={[styles.sheet, { maxHeight }, tall && { height: maxHeight }, keyboard > 0 && styles.sheetOnKeyboard]}
        >
          <View style={styles.grabber} accessibilityElementsHidden />
          {bare ? (
            !hideClose && (
              <View style={styles.bareClose}>
                <IconButton icon="close" label="Close" onPress={onClose} />
              </View>
            )
          ) : (
          <View style={styles.header}>
            {leading}
            <View style={[styles.titles, !leading && { paddingLeft: 6 }]}>
              <Text accessibilityRole="header" style={styles.title}>
                {title}
              </Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
            {trailing ?? (!hideClose && <IconButton icon="close" label="Close" onPress={onClose} />)}
          </View>
          )}
          {scroll ? (
            <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} keyboardShouldPersistTaps="handled">
              {children}
            </ScrollView>
          ) : (
            <View style={[styles.body, styles.bodyContent]}>{children}</View>
          )}
          {footer && <View style={[styles.footer, footerStacked && { gap: 4 }, { paddingBottom: keyboard > 0 ? 12 : insets.bottom + 4 }]}>{footer}</View>}
          {!footer && <View style={{ height: keyboard > 0 ? 8 : insets.bottom }} />}
        </View>
      </EnteringView>
    </Modal>
  );
}

/** Titled group inside a sheet. */
export function Section({ title, action, children, hint }: { title?: string; action?: ReactNode; hint?: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      {(title || action) && (
        <View style={styles.sectionHead}>
          {title && <Text style={styles.sectionTitle}>{title}</Text>}
          {action}
        </View>
      )}
      {children}
      {hint && <Text style={styles.sectionHint}>{hint}</Text>}
    </View>
  );
}

/** Bordered card that stacks rows with dividers. */
export function Group({ children }: { children: ReactNode }) {
  return <View style={styles.group}>{children}</View>;
}

type RowProps = {
  icon?: IconName;
  iconColor?: string;
  label: string;
  value?: string;
  valueTone?: 'default' | 'accent' | 'muted' | 'lunar';
  onPress?: () => void;
  last?: boolean;
  disabled?: boolean;
  /** Extra line under the value, e.g. the solar date of a lunar day. */
  detail?: string;
};

/** Settings-style row that opens a picker. */
export function PickerRow({ icon, iconColor = colors.textSoft, label, value, valueTone = 'default', onPress, last, disabled, detail }: RowProps) {
  const vColor = valueTone === 'accent' ? colors.accentRingDark : valueTone === 'muted' ? colors.textMuted : valueTone === 'lunar' ? ui.lunar : colors.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={`${label}: ${value ?? ''}${detail ? `, ${detail}` : ''}`}
      style={({ pressed }) => [styles.row, !last && styles.rowDivider, pressed && { backgroundColor: '#F7EEE1' }, disabled && { opacity: 0.45 }]}
    >
      {icon && <Icon name={icon} size={20} color={iconColor} />}
      <Text numberOfLines={1} style={styles.rowLabel}>
        {label}
      </Text>
      <View style={styles.rowValueWrap}>
        <Text numberOfLines={1} style={[styles.rowValue, { color: vColor }]}>
          {value}
        </Text>
        {detail && <Text style={styles.rowDetail}>{detail}</Text>}
      </View>
      {onPress && <Icon name="chevronRight" size={18} color={colors.textMuted} />}
    </Pressable>
  );
}

/** Footer layout: buttons share the row. */
export function FooterRow({ children }: { children: ReactNode }) {
  return <View style={styles.footerRow}>{children}</View>;
}

const styles = StyleSheet.create({
  anchor: { position: 'absolute', left: 0, right: 0 },
  sheet: {
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    borderWidth: 1.2,
    borderBottomWidth: 0,
    borderColor: ui.sheetBorder,
    backgroundColor: ui.sheet,
    boxShadow: elevation.sheet,
    overflow: 'hidden',
  },
  sheetOnKeyboard: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  grabber: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, marginTop: 8, backgroundColor: '#CFC6A0' },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 4, paddingTop: 6, paddingLeft: 14, paddingRight: 8, paddingBottom: 6 },
  titles: { flex: 1, paddingTop: 8, gap: 2 },
  bareClose: { position: 'absolute', right: 8, top: 10, zIndex: 2 },
  title: { ...font('900', 22, 28), letterSpacing: -0.8, color: '#270100' },
  subtitle: { ...font('500', 13.5, 18), color: colors.textSoft },
  body: { flexShrink: 1 },
  bodyContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20, gap: 22 },
  footer: { paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: ui.line, backgroundColor: ui.sheet },
  footerRow: { flexDirection: 'row', gap: 10 },

  section: { gap: 8 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 20 },
  sectionTitle: { ...font('800', 11.5, 15), letterSpacing: 1, textTransform: 'uppercase', color: '#794A26' },
  sectionHint: { ...font('500', 12.5, 17), color: colors.textMuted },

  group: { borderRadius: radii.lg, borderWidth: 1.2, borderColor: ui.cardBorder, backgroundColor: ui.card, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 11, minHeight: 54, paddingVertical: 8, paddingLeft: 14, paddingRight: 10 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: ui.line },
  rowLabel: { ...font('600', 15, 20), color: colors.text, flexShrink: 1 },
  rowValueWrap: { flex: 1, alignItems: 'flex-end' },
  rowValue: { ...font('700', 14.5, 20), textAlign: 'right' },
  rowDetail: { ...font('500', 12, 16), color: colors.textMuted, textAlign: 'right' },
});
