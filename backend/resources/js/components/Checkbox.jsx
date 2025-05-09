import { forwardRef, useEffect, useRef } from "react";

export default forwardRef(function Checkbox({ className = "", ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (input.current.indeterminate) {
            input.current.indeterminate = true;
        }
    }, []);

    return (
        <input
            {...props}
            type="checkbox"
            className={
                "rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 " +
                className
            }
            ref={input}
        />
    );
});
