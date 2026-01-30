import toast, { ToastOptions } from "react-hot-toast";
import ToastItem from "@/components/Toast/ToastItem";

const customToast = {
    success: (message: string, options?: ToastOptions) => {
        return toast.custom(
            (t) => (
                <ToastItem
                    t={t}
                    type="success"
                    title="Success"
                    message={message}
                />
            ),
            { ...options, duration: 4000 }
        );
    },
    error: (message: string, options?: ToastOptions) => {
        return toast.custom(
            (t) => (
                <ToastItem
                    t={t}
                    type="error"
                    title="Error"
                    message={message}
                />
            ),
            { ...options, duration: 5000 }
        );
    },
    loading: (message: string, options?: ToastOptions) => {
        return toast.custom(
            (t) => (
                <ToastItem
                    t={t}
                    type="loading"
                    title="Loading"
                    message={message}
                />
            ),
            { ...options, duration: Infinity }
        );
    },
    custom: (title: string, message: string, options?: ToastOptions) => {
        return toast.custom(
            (t) => (
                <ToastItem
                    t={t}
                    type="custom"
                    title={title}
                    message={message}
                />
            ),
            { ...options, duration: 4000 }
        );
    },
    dismiss: toast.dismiss,
};

export default customToast;
