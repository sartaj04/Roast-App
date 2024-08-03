import { StyleSheet, Text, Touchable, View } from "react-native";
import ReactNativeModal from "react-native-modal";
interface ModalProps extends React.PropsWithChildren {
  modalTitle: string;
  isVisible: boolean;
  onBackdropPress: () => void;
}

const Modal: React.FC<ModalProps> = ({ ...props }) => {
  return (
    <ReactNativeModal
      isVisible={props.isVisible}
      swipeDirection={"down"}
      coverScreen
      collapsable
      onBackdropPress={props.onBackdropPress}
      style={styles.modalContainer}
      presentationStyle="overFullScreen"
    >
      <View style={styles.modalContentContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{props.modalTitle}</Text>
          <Text style={styles.modalCloseButton} onPress={props.onBackdropPress}>
            X
          </Text>
        </View>
        <View style={styles.modalContent}>{props.children}</View>
      </View>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContentContainer: {
    flex: 0.9,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: "center",
    backgroundColor: "#19191A",
  },
  modalTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalCloseButton: {
    color: "white",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "white",
    width: 30,
    height: 30,
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "flex-end",
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 10,
    textTransform: "uppercase",
  },
  modalContent: {
    width: "100%",
    flex: 1,
    padding: 20,
    backgroundColor: "#1C1C1E",
  },
});
export default Modal;
