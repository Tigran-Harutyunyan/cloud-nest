import { registerSchema } from "../schemas";
import { useForm, configure } from "vee-validate";

export const useAuthForm = (type: FormType) => {
    const isLoading = ref(false);
    const errorMessage = ref("");
    const accountId = ref<string | null>(null);

    const isSignUpForm = computed(() => type === "sign-up");

    const SIGN_UP_TEXT = "Sign Up";
    const SIGN_IN_TEXT = "Sign In";

    const formTitle = computed(() => (isSignUpForm.value ? SIGN_UP_TEXT : SIGN_IN_TEXT));
    const linkText = computed(() => (isSignUpForm.value ? SIGN_IN_TEXT : SIGN_UP_TEXT));

    const apiUrl = computed(() => `/api/user/${isSignUpForm.value ? "register" : "login"}`);

    const { handleSubmit, values: formValues } = useForm({
        initialValues: {
            fullName: "",
            email: "",
        },
        validationSchema: registerSchema(type),
    });

    const submitForm = handleSubmit(async (values) => {
        isLoading.value = true;
        errorMessage.value = "";

        const payload: { email: string; fullName?: string } = { email: values.email };
        if (isSignUpForm.value) {
            payload.fullName = values.fullName;
        }

        try {
            const user = await $fetch<{ accountId: string | null }>(apiUrl.value, {
                method: "POST",
                body: payload,
            });

            if (user.accountId) {
                accountId.value = user.accountId;
            }
        } catch (err) {
            errorMessage.value =
                err instanceof Error ? err.message : "Failed to create account. Please try again.";
        } finally {
            isLoading.value = false;
        }
    });

    return {
        formTitle,
        linkText,
        isLoading,
        errorMessage,
        accountId,
        configure,
        isSignUpForm,
        formValues,
        submitForm,
    };
};
