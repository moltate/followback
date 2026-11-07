import { Alert, Platform, type AlertButton } from 'react-native';

// Browsers have no native Alert.alert, so confirm dialogs never appear on web.
// This makes it use the browser's own confirm/alert instead. Phones are not affected.
if (Platform.OS === 'web') {
  const w = globalThis as any;
  Alert.alert = (title: string, message?: string, buttons?: AlertButton[]) => {
    const text = [title, message].filter(Boolean).join('\n\n');
    if (!buttons || buttons.length === 0) {
      w.alert(text);
      return;
    }
    if (buttons.length === 1) {
      w.alert(text);
      buttons[0].onPress?.();
      return;
    }
    const cancel = buttons.find((b) => b.style === 'cancel');
    const action = buttons.find((b) => b !== cancel) ?? buttons[buttons.length - 1];
    if (w.confirm(text)) action.onPress?.();
    else cancel?.onPress?.();
  };
}