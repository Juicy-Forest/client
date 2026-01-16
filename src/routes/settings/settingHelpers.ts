export function createFieldEnhancer(config: {
  fieldName: string;
  formState: Record<string, { value: string; error: string; success: string }>;
  clearAllMessages: () => void;
  shouldReload?: boolean;
  onSuccess?: (data: Record<string, unknown>) => void;
}) {
  return () => {
    config.clearAllMessages();
    return async ({
      update,
      result,
    }: {
      update: () => void;
      result: Record<string, unknown>;
    }) => {
      if (result.type === "success") {
        const field = config.formState[config.fieldName];
        if (field) {
          const successData = result.data as
            | Record<string, unknown>
            | undefined;
          field.success = (successData?.message as string) ?? "";
          field.value = "";
        }
        config.onSuccess?.(result.data as Record<string, unknown>);
        if (config.shouldReload) {
          setTimeout(() => location.reload(), 1000);
        }
      } else if (result.type === "failure") {
        const field = config.formState[config.fieldName];
        if (field) {
          const failureData = result.data as
            | Record<string, unknown>
            | undefined;
          field.error = (failureData?.error as string) ?? "";
        }
      }
      update();
    };
  };
}
