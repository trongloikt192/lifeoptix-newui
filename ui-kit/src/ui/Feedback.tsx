import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Icon } from '../icons/Icon';
import type { IconName } from '../icons/Icon';
import { EnteringView, Modal, Pressable, StyleSheet, Text, View, useSafeAreaInsets } from '../primitives';
import { colors, elevation, font, radii, ui } from '../theme/tokens';
import { Button } from './Button';

/* ---------- Confirmation dialog ---------- */

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'danger' | 'default';
  icon?: IconName;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Centered, modal. Destructive action on the right, cancel is the safe default. */
export function ConfirmDialog({ visible, title, message, confirmLabel, cancelLabel = 'Cancel', tone = 'danger', icon = 'trash', onConfirm, onCancel }: ConfirmDialogProps) {
  const danger = tone === 'danger';
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={[StyleSheet.absoluteFill, styles.center, { backgroundColor: ui.scrim }]}>
        <EnteringView entering="ZoomIn">
          <View accessibilityViewIsModal accessibilityLabel={title} style={styles.dialog}>
            <View style={[styles.dialogIcon, danger ? { backgroundColor: ui.dangerSoft, borderColor: ui.dangerBorder } : { backgroundColor: ui.warnSoft, borderColor: ui.warnBorder }]}>
              <Icon name={icon} size={26} color={danger ? ui.danger : ui.warn} />
            </View>
            <Text accessibilityRole="header" style={styles.dialogTitle}>
              {title}
            </Text>
            <Text style={styles.dialogMessage}>{message}</Text>
            <View style={styles.dialogActions}>
              <Button label={cancelLabel} variant="secondary" grow onPress={onCancel} />
              <Button label={confirmLabel} variant={danger ? 'danger' : 'primary'} grow onPress={onConfirm} />
            </View>
          </View>
        </EnteringView>
      </View>
    </Modal>
  );
}

/* ---------- Toast / Snackbar ---------- */

export type ToastKind = 'success' | 'error' | 'info';
export type ToastOptions = { kind?: ToastKind; message: string; action?: { label: string; onPress: () => void }; duration?: number };

const ICON: Record<ToastKind, IconName> = { success: 'checkCircle', error: 'alert', info: 'trash' };

/** Presentational toast. Hosts usually render it through <ToastProvider>. */
export function Toast({ kind = 'success', message, action, onDismiss }: ToastOptions & { onDismiss?: () => void }) {
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion={kind === 'error' ? 'assertive' : 'polite'}
      style={[styles.toast, { backgroundColor: kind === 'error' ? ui.toastErrorBg : ui.toastBg }]}
    >
      <Icon name={ICON[kind]} size={21} color={kind === 'error' ? '#F6B9A6' : kind === 'success' ? '#C9DCA4' : ui.toastText} />
      <Text style={styles.toastText}>{message}</Text>
      {action && (
        <Pressable
          onPress={() => {
            action.onPress();
            onDismiss?.();
          }}
          style={({ pressed }) => [styles.toastAction, pressed && { opacity: 0.7 }]}
        >
          {action.label === 'Undo' && <Icon name="undo" size={17} color={ui.toastAction} strokeWidth={2.4} />}
          <Text style={styles.toastActionLabel}>{action.label}</Text>
        </Pressable>
      )}
      {!action && onDismiss && (
        <Pressable accessibilityLabel="Dismiss" onPress={onDismiss} style={styles.toastClose}>
          <Icon name="close" size={16} color={ui.toastText} />
        </Pressable>
      )}
    </View>
  );
}

const ToastContext = createContext<(o: ToastOptions) => void>(() => {});
export const useToast = () => useContext(ToastContext);

/**
 * Renders the latest toast above the tab bar and hides it after `duration`.
 * Pure React; in RN put it at the app root, inside SafeAreaProvider.
 */
export function ToastProvider({ children, bottomOffset = 92 }: { children: ReactNode; bottomOffset?: number }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<(ToastOptions & { key: number }) | null>(null);
  const timer = useRef(0);
  const show = useCallback((o: ToastOptions) => setToast({ ...o, key: Date.now() }), []);
  useEffect(() => {
    if (!toast) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), toast.duration ?? (toast.action ? 6000 : 3500));
    return () => window.clearTimeout(timer.current);
  }, [toast]);
  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <View pointerEvents="box-none" style={[styles.toastHost, { bottom: bottomOffset + Math.max(0, insets.bottom - 34) }]}>
          <EnteringView key={toast.key} entering="SlideInDown">
            <Toast {...toast} onDismiss={() => setToast(null)} />
          </EnteringView>
        </View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  dialog: {
    width: 326,
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 18,
    borderRadius: radii.xl,
    borderWidth: 1.2,
    borderColor: ui.sheetBorder,
    backgroundColor: ui.sheet,
    boxShadow: elevation.dialog,
  },
  dialogIcon: { width: 56, height: 56, borderRadius: 28, borderWidth: 1.2, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  dialogTitle: { ...font('900', 19, 25), color: colors.text, textAlign: 'center', letterSpacing: -0.3 },
  dialogMessage: { ...font('500', 14.5, 21), color: colors.textSoft, textAlign: 'center', marginTop: 6 },
  dialogActions: { flexDirection: 'row', gap: 10, alignSelf: 'stretch', marginTop: 22 },

  toastHost: { position: 'absolute', left: 14, right: 14, zIndex: 50 },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    minHeight: 54,
    paddingLeft: 15,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: 14,
    boxShadow: elevation.toast,
  },
  toastText: { ...font('600', 14.5, 20), color: ui.toastText, flex: 1 },
  toastAction: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 44, paddingHorizontal: 11, borderRadius: 10 },
  toastActionLabel: { ...font('800', 14.5, 20), color: ui.toastAction },
  toastClose: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
