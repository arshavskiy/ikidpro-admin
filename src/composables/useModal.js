import { ref, reactive } from "vue";

export function useModal() {
  const isVisible = ref(false);
  const modalData = reactive({
    title: "",
    message: "",
    type: "info",
    showConfirm: true,
    showCancel: true,
    confirmText: "Confirm",
    cancelText: "Cancel",
    closeOnBackdrop: true,
  });

  const show = (options = {}) => {
    Object.assign(modalData, {
      title: "",
      message: "",
      type: "info",
      showConfirm: true,
      showCancel: true,
      confirmText: "Confirm",
      cancelText: "Cancel",
      closeOnBackdrop: true,
      ...options,
    });
    isVisible.value = true;
  };

  const hide = () => {
    isVisible.value = false;
  };

  const confirm = (options = {}) => {
    return new Promise((resolve) => {
      show({
        type: "question",
        showConfirm: true,
        showCancel: true,
        ...options,
      });

      const handleConfirm = () => {
        hide();
        resolve(true);
      };

      const handleCancel = () => {
        hide();
        resolve(false);
      };

      // Return cleanup functions for the component to use
      modalData.onConfirm = handleConfirm;
      modalData.onCancel = handleCancel;
      modalData.onClose = handleCancel;
    });
  };

  const alert = (options = {}) => {
    return new Promise((resolve) => {
      show({
        type: "info",
        showConfirm: true,
        showCancel: false,
        confirmText: "OK",
        ...options,
      });

      const handleConfirm = () => {
        hide();
        resolve(true);
      };

      modalData.onConfirm = handleConfirm;
      modalData.onCancel = handleConfirm;
      modalData.onClose = handleConfirm;
    });
  };

  const error = (options = {}) => {
    return alert({
      type: "error",
      title: "Error",
      confirmText: "OK",
      ...options,
    });
  };

  const success = (options = {}) => {
    return alert({
      type: "success",
      title: "Success",
      confirmText: "OK",
      ...options,
    });
  };

  const warning = (options = {}) => {
    return confirm({
      type: "warning",
      title: "Warning",
      confirmText: "Continue",
      cancelText: "Cancel",
      ...options,
    });
  };

  return {
    isVisible,
    modalData,
    show,
    hide,
    confirm,
    alert,
    error,
    success,
    warning,
  };
}
