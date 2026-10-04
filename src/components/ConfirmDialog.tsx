import { Modal, Text, View } from "react-native";
import { Button } from "./ui";
export interface Confirmation {
  title: string;
  message: string;
  label: string;
  action: () => void;
}
export function ConfirmDialog({
  confirmation,
  close,
}: {
  confirmation: Confirmation | null;
  close: () => void;
}) {
  return (
    <Modal
      visible={!!confirmation}
      transparent
      animationType="fade"
      onRequestClose={close}
    >
      <View className="flex-1 items-center justify-center bg-black/80 px-6">
        <View
          accessibilityViewIsModal
          className="w-full max-w-md gap-5 rounded-3xl border border-line bg-panel p-6"
        >
          <Text className="text-2xl font-bold text-white">
            {confirmation?.title}
          </Text>
          <Text className="text-base leading-6 text-muted">
            {confirmation?.message}
          </Text>
          <Button
            label={confirmation?.label ?? "Confirm"}
            onPress={() => {
              confirmation?.action();
              close();
            }}
          />
          <Button label="Cancel" secondary icon="x" onPress={close} />
        </View>
      </View>
    </Modal>
  );
}
