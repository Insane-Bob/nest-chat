import { toast } from 'vue-sonner';

export interface Toast {
    id: number
    message: string
    type: 'success' | 'error' | 'info'
}

export function useToast() {
    function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
        const options = {
            style: {},
            class: '',
            descriptionClass: '',
        };

        if (type === 'success') options.style.background = '#6ee7b7';
        if (type === 'error') options.style.background = '#f87171';
        if (type === 'info') options.style.background = '#3b82f6';

        if (type === 'error') toast.error(message, options);
        else if (type === 'success') toast.success(message, options);
        else toast(message, options);
    }

    return { showToast };
}

